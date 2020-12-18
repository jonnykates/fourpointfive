const validHexColour = (colour) => {
  const colourRegex = /^#[0-9A-F]{6}$/i;

  if (!colourRegex.test(colour)) {
    return false;
  }

  return true;
};

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToLuminosity = (rgbObject) => {
  var colourComponents = {
    r: null,
    g: null,
    b: null,
  };

  for (colour in rgbObject) {
    var colourLuminosity = rgbObject[colour] / 255;

    if (colourLuminosity < 0.03938) {
      colourLuminosity = colourLuminosity / 12.92;
    } else {
      colourLuminosity = Math.pow((colourLuminosity + 0.055) / 1.055, 2.4);
    }

    colourComponents[colour] = colourLuminosity;
  }

  colourComponents.r = colourComponents.r * 0.2126;
  colourComponents.g = colourComponents.g * 0.7152;
  colourComponents.b = colourComponents.b * 0.0722;

  const luminosity =
    colourComponents.r + colourComponents.g + colourComponents.b;

  return luminosity;
};

const contrastRatioBetweenTwoLuminosities = (luminanceOne, luminanceTwo) => {
  lighterLuminance = Math.max(luminanceOne, luminanceTwo);
  darkerLuminance = Math.min(luminanceOne, luminanceTwo);

  const contrastRatio = (lighterLuminance + 0.05) / (darkerLuminance + 0.05);

  return contrastRatio.toFixed(2);
};

const contrastChecker = () => {
  const foregroundHexColour = document.getElementById("foreground-input").value;
  const backgroundHexColour = document.getElementById("background-input").value;

  if (
    !validHexColour(foregroundHexColour) ||
    !validHexColour(backgroundHexColour)
  ) {
    console.log("Please enter a valid colour!");
    return;
  }

  const foregroundRgbColour = hexToRgb(foregroundHexColour);
  const backgroundRgbColour = hexToRgb(backgroundHexColour);

  const foregroundLuminosity = rgbToLuminosity(foregroundRgbColour);
  const backgroundLuminosity = rgbToLuminosity(backgroundRgbColour);

  const contrastRatio = contrastRatioBetweenTwoLuminosities(
    foregroundLuminosity,
    backgroundLuminosity
  );

  document.getElementById("contrast-ratio").innerHTML = contrastRatio;
};

contrastChecker();