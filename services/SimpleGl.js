var vertex = {
    0, 0, 1,
    1, 0, 1,
    0, 1, 1
};

var normal = {
    0, 0, -1,
    0, 0, -1,
    0, 0, -1
}

var texUV = {
    0, 0,
    0, 0,
    0, 0
}

var indice = {
    0, 1, 2
}

var matrixPerspective;
var matrixViewModel;
var matrixNormal;

glDraw(&indice, indiceSize, &vertex, &normal, &texUV);

function shaderVertex(vertex, normal) {
    vertex = /* apply matrixes */0;
    normal = /* apply matrixes */0;
}

function shaderFragment(vertex, normal, uv, distanceToEdge) {
    var color;

    color = /* apply lightning, texture etc */

    return color;
}

// --------------------------
// internals

glDraw(indice, indiceSize, vertex, normal, texUV) {
    var v[3], n[3], uv[2];
    
    for (i = 0; i < indiceSize; i += 3) {
        // pick: vertex, normal, uv of triangle

        shaderVertex(&v, &n);
        if (!isInsideView(vertex)) {
            continue;
        }

        // transpose vertex to view port
        fbGetWidth();
        fbGetHeight();

        for (y = 0) {
            for (x = 0) {
                if (inTriangle()) {
                    // interpolate Z axis value
                    // depth test
                    if (isFragmentBehind()) {
                        /* break flag */
                    }
                    // update Zbuffer for this fragment
                    distanceToEdge = 0 /* compute distance to closest edge of the triangle */;
                    color = shaderFragment(interpolatedVertex, interpolatedNormal, interpolatedUv, distanceToEdge);
                    fbSet(x, y, color);
                }
            }
        }
        

    }

}
