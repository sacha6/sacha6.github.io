var img = new Image();
img.crossOrigin = 'Anonymous';
img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/41/Siberischer_tiger_de_edit02.jpg';
// img.src = 'file:///test.png';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// fonction téléversement de l'image
const uploadImage = function () {
    console.log("hello");
    f = document.getElementById("uploadimage").files[0];
    url = window.URL || window.webkitURL;
    src = url.createObjectURL(f);

    img.src = src;
}

// fonction  téléchargement de l'image au format jpeg
const downloadImage = function (el) {
    var image = canvas.toDataURL("image/jpg");
    el.href = image;
};

// fonction qui permet d'afficher l'image ajustée à la taille du canvas
img.onload = function () {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
};

// const original = function () {
//     ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
// };

// fonction qui calcule une image dans les tons sépia
const sepia = function (data) {
    for (var i = 0; i < data.length; i += 4) {
        let red = data[i], green = data[i + 1], blue = data[i + 2];

        data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
        data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
        data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
    }
}

// fonction qui inverse les couleurs d'une image 
const invert = function (data) {
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
};

// fonction qui calcule une image dans les tons gris
const grayscale = function (data) {
    for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
};

// fonction qui crypte l'image comme canal+
const canal = function (data, width, height) {
    width *= 4;
    var delta = 0;
    for (var j = 0; j < height; j++) {
        // decalage de + ou - 10 pixels
        var decalage = (Math.floor(Math.random() * 40) - 20) * 4;
        if (decalage > 0) {
            for (var i = 0; i < width - decalage; i++) {
                data[delta + i] = data[delta + i + decalage];
            }
            // on rempli avec du noir
            for (; i < width; i += 4) {
                data[delta + i] = 0;
                data[delta + i + 1] = 0;
                data[delta + i + 2] = 0;
            }
        } else {
            for (var i = width - 1; i > decalage; i--) {
                data[delta + i - decalage] = data[delta + i];
            }
            //on rempli avec du noir
            for (; i > 0; i -= 4) {
                data[delta + i - 1] = 0;
                data[delta + i - 2] = 0;
                data[delta + i - 3] = 0;
            }
        }
        delta = delta + width
    }
};

// fonction qui découpe l'image en petits morceaux de 32 pixels puis les mélanges
const grille = function (data, width, height) {
    width *= 4;
    const size = 32;

    var cellOrder = [];
    for (var j = 0; j < height; j += size) {
        for (var i = 0; i < width; i += size * 4) {
            cellOrder.push(j * width + i);
        }
    }

    melangeTableau(cellOrder);
    for (var j = 0; j < height; j += size) {
        for (var i = 0; i < width; i += size * 4) {
            echangeCellule(data, j * width + i, cellOrder.pop(), size, height, width);
        }
    }
};

// fonctino qui mélange un tableau
const melangeTableau = function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// fonction qui échange 2 cellules
const echangeCellule = function (data, pos1, pos2, size, height, width) {
    for (var j = 0; j < Math.min(size, height); j++) {
        for (var i = 0; i < Math.min(size * 4, width); i++) {
            var s = data[pos1 + j * width + i];
            data[pos1 + j * width + i] = data[pos2 + j * width + i];
            data[pos2 + j * width + i] = s;
        }
    }
}

// fonction qui calcule la nouvelle luminosité
const brightness = function (data, adjustment) {
    for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] + adjustment;
        data[i + 1] = data[i + 1] + adjustment;
        data[i + 2] = data[i + 2] + adjustment;
    }
};

// fonction qui calcule le contrast 
// https://stackoverflow.com/questions/10521978/html5-canvas-image-contrast/37714937

const contrast = function (data, contrast) {
    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (var i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }
}

var interval;
var delay = undefined;
var filter = undefined;
var process = undefined;
var brightnessVariation = 0;
var contrastVariation = 0;

// on écoute les évènements pour la luminosité
const brightnessInput = document.getElementById('brightness');
brightnessInput.addEventListener("input", function (evt) {
    brightnessVariation = evt.target.valueAsNumber;
    processImage();
});

// on écoute les évènements pour le contrast
const contrastInput = document.getElementById('contrast');
contrastInput.addEventListener("input", function (evt) {
    contrastVariation = evt.target.valueAsNumber;
    processImage();
});

const colorInputs = document.querySelectorAll('[name=color]');

for (const input of colorInputs) {
    input.addEventListener("change", function (evt) {
        switch (evt.target.value) {
            case "inverted":
                filter = invert; break;
            case "grayscale":
                filter = grayscale; break;
            case "sepia":
                filter = sepia; break;
            default:
                filter = undefined;
        }
        processImage();
    });
}

const processInputs = document.querySelectorAll('[name=process]');
for (const input of processInputs) {
    input.addEventListener("change", function (evt) {
        switch (evt.target.value) {
            case "canal":
                process = canal; delay = 100; break;
            case "grille":
                process = grille; delay = 1000; break;
            default:
                process = undefined;
        }
        clearInterval(interval);
        if (process && delay) {
            interval = setInterval(processImage, delay);
        } else {
            processImage();
        }
    });
}

const resetInput = document.getElementById('reset');
resetInput.addEventListener("click", function (evt) {
    contrastInput.value = "0";
    contrastVariation = 0;
    brightnessInput.value = "0";
    brightnessVariation = 0;
    delay = undefined;
    filter = undefined;
    process = undefined;
    colorInputs[0].checked = true;
    processInputs[0].checked = true;
    processImage();
});


const processImage = function () {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    if (filter) {
        filter(data)
    }
    if (process) {
        process(data, imageData.width, imageData.height)
    }
    if (brightnessVariation != 0) {
        brightness(data, brightnessVariation)
    }
    if (contrastVariation != 0) {
        contrast(data, contrastVariation)
    }
    ctx.putImageData(imageData, 0, 0);
}
