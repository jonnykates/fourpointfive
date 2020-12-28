const validHexColour = (colour) => {
  const colourRegex = /^#[0-9A-F]{6}$/i;

  if (!colourRegex.test(colour)) {
    return false;
  }

  return true;
};

const hexToLuminosity = (hex) => {
  const hexToRgbRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

  let rgb = hexToRgbRegex.exec(hex);

  rgb = {
    r: parseInt(rgb[1], 16),
    g: parseInt(rgb[2], 16),
    b: parseInt(rgb[3], 16),
  };

  for (colour in rgb) {
    var colourLuminosity = rgb[colour] / 255;

    if (colourLuminosity < 0.03938) {
      colourLuminosity = colourLuminosity / 12.92;
    } else {
      colourLuminosity = Math.pow((colourLuminosity + 0.055) / 1.055, 2.4);
    }

    rgb[colour] = colourLuminosity;
  }

  rgb.r = rgb.r * 0.2126;
  rgb.g = rgb.g * 0.7152;
  rgb.b = rgb.b * 0.0722;

  return rgb.r + rgb.g + rgb.b;
};

const contrastRatioBetweenTwoLuminosities = (luminanceOne, luminanceTwo) => {
  lighterLuminance = Math.max(luminanceOne, luminanceTwo);
  darkerLuminance = Math.min(luminanceOne, luminanceTwo);

  const contrastRatio = (lighterLuminance + 0.05) / (darkerLuminance + 0.05);

  return contrastRatio.toFixed(2);
};

const contrastChecker = () => {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("suggestion").classList.add("hidden");

  document.getElementById("result-mark").innerHTML = "Pass";
  document.getElementById("result-direction").innerHTML = "above";

  const foregroundHexColour = document.getElementById("foreground-input").value;
  const backgroundHexColour = document.getElementById("background-input").value;

  if (
    !validHexColour(foregroundHexColour) ||
    !validHexColour(backgroundHexColour)
  ) {
    console.log("Please enter a valid colour!");
    return;
  }

  const foregroundLuminosity = hexToLuminosity(foregroundHexColour);
  const backgroundLuminosity = hexToLuminosity(backgroundHexColour);

  const contrastRatio = contrastRatioBetweenTwoLuminosities(
    foregroundLuminosity,
    backgroundLuminosity
  );

  document.getElementById("ratio-original").innerHTML = contrastRatio;

  if (contrastRatio < 4.5) {
    document.getElementById("result-mark").innerHTML = "Fail!";
    document.getElementById("result-direction").innerHTML = "below";

    const targetSource =
      foregroundLuminosity < backgroundLuminosity ? "foreground" : "background";

    let targetHexColour =
      foregroundLuminosity < backgroundLuminosity
        ? foregroundHexColour
        : backgroundHexColour;

    const targetHexColourOriginal = targetHexColour;

    const staticHexColour =
      targetHexColour == foregroundHexColour
        ? backgroundHexColour
        : foregroundHexColour;

    let percentageDarker = 0;

    while (
      contrastRatioBetweenTwoLuminosities(
        hexToLuminosity(targetHexColour),
        hexToLuminosity(staticHexColour)
      ) < 4.5
    ) {
      percentageDarker++;
      targetHexColour = pSBC(
        (percentageDarker / 100) * -1,
        targetHexColourOriginal
      );
    }

    const newContrastRatio = contrastRatioBetweenTwoLuminosities(
      hexToLuminosity(targetHexColour),
      hexToLuminosity(staticHexColour)
    );

    document.getElementById("suggested-hex-main").innerHTML = targetHexColour;
    document.getElementById("suggested-hex").innerHTML = targetHexColour;
    document.getElementById("suggested-source").innerHTML = targetSource;
    document.getElementById(
      "suggested-percentage"
    ).innerHTML = percentageDarker;
    document.getElementById("ratio-suggested").innerHTML = newContrastRatio;

    document.getElementById("result").classList.remove("hidden");
    document.getElementById("suggestion").classList.remove("hidden");
  }
};

contrastChecker();
