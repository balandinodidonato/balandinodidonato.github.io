/* User Interface Handling Functions*/
function getNexusElements(type) {
  var nexusInterfaceElements = {};
  var divElements = document.getElementsByTagName("div");
  for (var element in divElements) {
    if (typeof divElements[element] === "object" &&
      divElements[element].hasAttribute("nexus-ui")) {
      if (!nexusInterfaceElements.hasOwnProperty(divElements[element].id)) {
        switch (type) {
          default: var e = window[divElements[element].id];
          nexusInterfaceElements[divElements[element].id] = e;
          break;
          case 'slider':
            var e = window[divElements[element].id];
            if (e.constructor.name == 'Slider') nexusInterfaceElements[divElements[element].id] = e;
            break;
          case 'dial':
            var e = window[divElements[element].id];
            if (e.constructor.name == 'Dial') nexusInterfaceElements[divElements[element].id] = e;
            break;
          case 'button':
            var e = window[divElements[element].id];
            if (e.constructor.name == 'TextButton' || e.constructor.name == 'Button') nexusInterfaceElements[divElements[element].id] = e;
            break;
          case 'toggle':
            var e = window[divElements[element].id];
            if (e.constructor.name == 'Toggle') nexusInterfaceElements[divElements[element].id] = e;
            break;
        };
      }
    }
  }
  return nexusInterfaceElements;
};

function updateInterface(elements, Factory) {
  var nElements = elements;
  if (Array.isArray(nElements) && nElements.length > 0) {
    var elementObject = {};
    for (let i in nElements) {
      var element = window[nElements[i]];
      if (element["parent"] != undefined && element.parent.hasAttribute("nexus-ui")) elementObject[nElements[i]] = element;
    };
    nElements = elementObject;
    delete elementObject, element;
  } else nElements = getNexusElements();
  var Factory = Factory || window.Factory;
  var plugins = [];
  for (let e in nElements) {
    if (nElements[e].parameter) {
      var plugin = plugins.filter(function(value) { return (value.id == nElements[e].parameter.plugin.id); });
      if (plugin.length == 0) {
        plugin = getPlugin(parseInt(nElements[e].parameter.plugin.id), Factory);
        plugins = plugins.concat(plugin);
      };
      var changeEvents = nElements[e]._events.change;
      nElements[e]._events.change = nElements[e]._events.change.filter(function(element) { return element.name != 'binder'; });
      switch (nElements[e].constructor.name) {
        default:
        case 'Dial':
        case 'Slider': nElements[e].value = plugin[0].node.getParameterByName(nElements[e].parameter.name).value;
        break;
        case 'Select': nElements[e].selectedIndex = plugin[0].node.getParameterByName(nElements[e].parameter.name).value;
          break;
        case 'Toggle': nElements[e].state = Boolean(plugin[0].node.getParameterByName(nElements[e].parameter.name).value);
          break;
      };
      nElements[e]._events.change = changeEvents;
    };
  };
  console.log("%c updateInterface complete", "color:orange; font-weight: bold");
  return nElements;
};

/** RANDOMISATION **/
function randomiseNexus_(selection, percent, parametersObject, Factory) {
  var nexusElements = getNexusElements();
  for (var Index in selection) {
    var Id = selection[Index],param = nexusElements[Id].parameter;
    parametersObject[param.plugin.uniqueID][param.plugin.id][param.name] = randomiseNexusElement(Id, percent);
  };
  updatePluginParameters(parametersObject, Factory);
};

// calculate min-max random values in relation to (i) min-max element range (ii) random percentage (in relation to the slider range) and (iii) last user input
// last user input is the mid point reference for the random range (random range= last input +- half random percentage)
function randomiseNexusElement(Id, percent) {
  var nexusElement = getNexusElements()[Id];
  var lastElementValue = parseFloat(nexusElement.lastinput);
  var MaxValue = parseFloat(nexusElement.max);
  var MinValue = parseFloat(nexusElement.min);
  var Range = MaxValue - MinValue;
  var max = (percent * 0.005 * Range) + lastElementValue;
  var min = lastElementValue - (percent * 0.005 * Range);
  var rescaledMax = max + (Math.abs(MinValue - min));
  var rescaledMin = min - (Math.abs(max - MaxValue));
  // if random range < or > than element min-max range, rescale min-max range to keep the percentage invariated (moving range)
  if (min <= MinValue) {
    max = rescaledMax,min = MinValue;
  } else if (max >= MaxValue) {
    max = MaxValue,min = rescaledMin;
  }
  nexusElement.value = generateRandomValue(min, max);
  return nexusElement.value;
};

function generateRandomValue(minVal, maxVal) { return Math.random() * (maxVal - minVal) + minVal; };// generate the random number within the calculated range

function setupRandomiser(selectorId, buttonId) {
  var randomSelector = document.getElementById(selectorId);
  var labels = document.getElementsByTagName('label');
  var nexusSliderNames = Object.keys(getNexusElements('slider'));
  var nexusDialNames = Object.keys(getNexusElements('dial'));
  for (var labelIndex in labels) {
    if ((nexusSliderNames.includes(labels[labelIndex].htmlFor)) || (nexusDialNames.includes(labels[labelIndex].htmlFor)))
    {
      randomSelector.options[randomSelector.options.length] = new Option(labels[labelIndex].textContent,labels[labelIndex].htmlFor);
    }
  }
  var randButton = getNexusElements()[buttonId];
  randButton.on('change',function(data) { if (data) randomiseNexus_(selectedValuesMultiple("selectParameterToRandomise"),sliderRandomPercentInput.value,parametersObject,Factory) });
  console.log("%c setupRandomiser complete", "color:orange; font-weight: bold");
}

/** KEYS **/
function cleanDial(dial) {
  if (dial && dial.type === "Dial") {
    dial.handle.setAttribute("stroke", 'none');
    dial.handle2.setAttribute("stroke", 'none');
    dial.handleFill.setAttribute("fill", 'none');
    dial.handle2Fill.setAttribute("fill", 'none');
  }
}

function isNexus(obj) {
  if(typeof obj === "object" && obj != null) return obj.parent.hasAttribute("nexus-ui")
  else return false;
}

function resizeSliders() {
  let UIsliders = getNexusElements('slider');
  let width = document.getElementsByClassName("synth-center")[0].offsetWidth;
  for( let s in UIsliders) {
    let sliderParent = UIsliders[s].parent.parentElement;
    if(sliderParent.className == 'synth-slider') UIsliders[s].resize(width * 0.85, UIsliders[s].height);
  }
}
