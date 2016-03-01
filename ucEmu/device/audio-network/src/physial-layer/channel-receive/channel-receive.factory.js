var ChannelReceive = (function () {
    'use strict';

    _ChannelReceive.$inject = [];

    function _ChannelReceive() {
        var CR;
            
        CR = function (index, configuration) {
            this.analyserNode = null;  // empty analyser needs to be connected to script node
            this.scriptNode = null;
            this.carrierRecovery = [];
            this.carrierFrequency = [];
            this.$$notifyInterval = null;
            this.$$notifyHandler = null;
            this.$$sampleNumber = 0;
            this.$$index = index;

            this.init();
            this.configure(configuration);
        };

        CR.prototype.configure = function (configuration) {
            var i, cr, samplePerPeriod, frequency;

            this.carrierRecovery.length = 0;
            for (i = 0; i < configuration.ofdmSize; i++) {
                frequency = configuration.baseFrequency + i * configuration.ofdmFrequencySpacing;
                samplePerPeriod = Audio.getSampleRate() / frequency;
                cr = CarrierRecoveryBuilder.build(samplePerPeriod, configuration.dftSize);
                this.carrierRecovery.push(cr);
                this.carrierFrequency.push(frequency);
            }

            this.$$notifyInterval = configuration.notifyInterval;
            this.$$notifyHandler = configuration.notifyHandler;
            this.$$sampleNumber = 0;
        };

        CR.prototype.init = function () {
            var self = this;

            this.scriptNode = Audio.createScriptProcessor(1 * 1024, 1, 1);
            this.scriptNode.onaudioprocess = function (audioProcessingEvent) {
                self.onAudioProcess(audioProcessingEvent);
            };

            this.analyserNode = Audio.createAnalyser();
            this.analyserNode.fftSize = 512;

            this.scriptNode.connect(this.analyserNode);
        };


        CR.prototype.getFirstNode = function () {
            return this.scriptNode;
        };

        CR.prototype.getFrequency = function (ofdmIndex) {
            if (ofdmIndex < 0 || ofdmIndex >= this.carrierFrequency.length) {
                throw 'OFDM index out of range: ' + ofdmIndex;
            }

            return this.carrierFrequency[ofdmIndex];
        };

        CR.prototype.setFrequency = function (ofdmIndex, frequency) {
            var samplePerPeriod;

            if (ofdmIndex < 0 || ofdmIndex >= this.carrierFrequency.length) {
                throw 'OFDM index out of range: ' + ofdmIndex;
            }

            samplePerPeriod = Audio.getSampleRate() / frequency;
            this.carrierRecovery[ofdmIndex].setSamplePerPeriod(samplePerPeriod);
            this.carrierFrequency[ofdmIndex] = frequency;
        };

        CR.prototype.onAudioProcess = function (audioProcessingEvent) {
            var
                inputBuffer = audioProcessingEvent.inputBuffer,
                inputData = inputBuffer.getChannelData(0),
                notifyIteration, sample, cr, i, j,
                carrierData = []
            ;

            for (i = 0; i < inputBuffer.length; i++) {
                sample = inputData[i];
                notifyIteration = (this.$$sampleNumber % this.$$notifyInterval === 0);

                if (notifyIteration) {
                    carrierData.length = 0;
                }

                for (j = 0; j < this.carrierRecovery.length; j++) {
                    cr = this.carrierRecovery[j];
                    cr.handleSample(sample);
                    if (notifyIteration) {
                        carrierData.push(cr.getCarrier());
                    }
                }

                if (notifyIteration) {
                    this.$$notifyHandler(this.$$index, carrierData);
                }

                this.$$sampleNumber++;
            }
        };

        CR.prototype.destroy = function () {
            this.scriptNode.disconnect(this.analyserNode);
            this.carrierRecovery.length = 0;
        };

        return CR;
    }

    return _ChannelReceive();        // TODO change it to dependency injection

})();
