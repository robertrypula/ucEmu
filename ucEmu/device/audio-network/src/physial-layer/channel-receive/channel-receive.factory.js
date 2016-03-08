var ChannelReceive = (function () {
    'use strict';

    _ChannelReceive.$inject = [];

    function _ChannelReceive() {
        var CR;
            
        CR = function (index, configuration) {
            this.carrierRecovery = [];
            this.carrierFrequency = [];
            this.carrierPhaseCorrection = [];
            this.$$notifyInterval = null;
            this.$$notifyHandler = null;
            this.$$index = index;

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
                this.carrierPhaseCorrection.push(0);
            }

            this.$$notifyInterval = configuration.notifyInterval;
            this.$$notifyHandler = configuration.notifyHandler;
        };

        CR.prototype.$$checkOfdmIndex = function (ofdmIndex) {
            if (ofdmIndex < 0 || ofdmIndex >= this.carrierFrequency.length) {
                throw 'OFDM index out of range: ' + ofdmIndex;
            }
        };

        CR.prototype.getRxPhaseCorrection = function (ofdmIndex) {
            this.$$checkOfdmIndex(ofdmIndex);

            return this.carrierPhaseCorrection[ofdmIndex];
        };

        CR.prototype.getFrequency = function (ofdmIndex) {
            this.$$checkOfdmIndex(ofdmIndex);

            return this.carrierFrequency[ofdmIndex];
        };

        CR.prototype.setRxPhaseCorrection = function (ofdmIndex, phaseCorrection) {
            this.$$checkOfdmIndex(ofdmIndex);

            this.carrierPhaseCorrection[ofdmIndex] = phaseCorrection - Math.floor(phaseCorrection);
        };

        CR.prototype.setFrequency = function (ofdmIndex, frequency) {
            var samplePerPeriod;

            this.$$checkOfdmIndex(ofdmIndex);

            samplePerPeriod = Audio.getSampleRate() / frequency;
            this.carrierRecovery[ofdmIndex].setSamplePerPeriod(samplePerPeriod);
            this.carrierFrequency[ofdmIndex] = frequency;
        };

        CR.prototype.handleSample = function (sample, sampleNumberGlobal, blockBeginTime, sampleNumberInBlock) {
            var notifyIteration, cr, cd, i, carrierDetail, sampleTimeOffsetInBlock;

            notifyIteration = (sampleNumberGlobal % this.$$notifyInterval === 0);

            if (notifyIteration) {
                carrierDetail = [];
            }

            for (i = 0; i < this.carrierRecovery.length; i++) {
                cr = this.carrierRecovery[i];
                cr.handleSample(sample);
                if (notifyIteration) {
                    cd = cr.getCarrierDetail();
                    cd.phase = cd.phase - this.carrierPhaseCorrection[i];
                    cd.phase = cd.phase - MathUtil.floor(cd.phase);
                    carrierDetail.push(cd);
                }
            }

            if (notifyIteration) {
                sampleTimeOffsetInBlock = sampleNumberInBlock / Audio.getSampleRate();

                this.$$notifyHandler(
                    this.$$index, 
                    carrierDetail,
                    blockBeginTime + sampleTimeOffsetInBlock
                );
            }
        };

        CR.prototype.destroy = function () {
            this.carrierRecovery.length = 0;
            this.carrierFrequency.length = 0;
            this.carrierPhaseCorrection.length = 0;
        };

        return CR;
    }

    return _ChannelReceive();        // TODO change it to dependency injection

})();