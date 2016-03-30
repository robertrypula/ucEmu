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

    color = 0/* apply lightning, texture etc */

    return color;
}


px = i*v1x + j*v2x;
py = i*v1y + j*v2y;

px - j*v2x = i*v1x;
i = (px - j*v2x) / v1x;
py = i*v1y + j*v2y;
py = ((px*v1y - j*v2x*v1y) / v1x) + j*v2y;
py*v1x = px*v1y - j*v2x*v1y + j*v2y*v1x;
py*v1x = px*v1y - j*(v2x*v1y + v2y*v1x);
j*(v2x*v1y + v2y*v1x) = px*v1y - py*v1x;
j = (px*v1y - py*v1x) / (v2x*v1y + v2y*v1x);


    i = (px - j*v2x) / v1x;
    i * v1x = px - j*v2x;
    i * v1x = px - (px*v1y*v2x - py*v1x*v2x) / (v2x*v1y + v2y*v1x);
    i = px/v1x - (px*v1y*v2x - py*v1x*v2x) / (v2x*v1y + v2y*v1x)*v1x;

px = i*v1x + j*v2x;
px - i*v1x = j*v2x;
j = (px - i*v1x) / v2x;
py = i*v1y + ((px - i*v1x) / v2x)*v2y;
py = i*v1y + (px*v2y - i*v1x*v2y) / v2x;
py*v2x = i*v1y*v2x + px*v2y - i*v1x*v2y;
py*v2x = i*v1y*v2x - i*v1x*v2y + px*v2y;
py*v2x = i*(v1y*v2x - v1x*v2y) + px*v2y;
py*v2x - px*v2y = i*(v1y*v2x - v1x*v2y);
i = (py*v2x - px*v2y) / (v1y*v2x - v1x*v2y);



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
