document.onkeydown = function (event) {
  if (event.altKey && event.keyCode == 'R'.charCodeAt(0)) {
    event.preventDefault();
    recordButton.click();
  }
  if (event.altKey && event.keyCode == 'S'.charCodeAt(0)) {
    event.preventDefault();
    recordButton.click();
  }
  if (event.keyCode == '13') { // enter
    event.preventDefault();
    startButton.click();
  }
  if (event.keyCode == '32') { // when you hit space bar
    event.preventDefault();
    startStop.click(); //check name
    explodeButton.click();//check name
    fireButton.click(); //check name
    shakeButton.click();
    triggerButton.click();
    changeButton.click();
    roarButton.click();
    dropletsButton.click();
    oneBounceButton.click();
    rampButtonNexus.click();
    runButton.click();
  }
  if (event.keyCode == '37') {
    event.preventDefault();
    if (masterPanVal>-1) masterPanVal = masterPanVal - 0.02;
    masterPanInput.value=masterPanVal;
  }
  if (event.keyCode == '38') {
  event.preventDefault();
    if (masterGainVal<1.2) masterGainVal = masterGainVal + 0.01;
    masterGainInput.value=masterGainVal;
  }
  if (event.keyCode == '39') { // when you hit space bar
    event.preventDefault();
    if (masterPanVal<1) masterPanVal = masterPanVal + 0.02;
    masterPanInput.value=masterPanVal;
  }
  if (event.keyCode == '40') { // when you hit space bar
    event.preventDefault();
    if (masterGainVal>0) masterGainVal = masterGainVal - 0.01;
    masterGainInput.value=masterGainVal;
  }
  if (event.keyCode == '77' && document.getElementById('mce-EMAIL')!=document.activeElement) { // M
    event.preventDefault();
    muteSwitch.click();
  }
}
