window.onload = () => {
  document.querySelector('body > div > div.box2').style.display = 'block';
  document.querySelectorAll('h3').forEach(h3 => {
    const newH3 = h3;
    newH3.style.display = 'block';
    return newH3;
  });
  document.getElementById('code').style.display = 'block';
  document.querySelector('a.ripple').style.display = 'inline-block';
  document.getElementById('result').innerHTML = "Paste the JSON file's content in the input box and click the button above to check for errors.<br /><br />The result will be displayed here!";
};

const editor = CodeMirror(document.getElementById('code'), {
  mode: {
    name: 'javascript',
    json: true,
  },
  theme: 'material-darker',
  lineWrapping: true,
});
const button = document.querySelector('a.ripple');
let enabled = false;
button.addEventListener('click', e => {
  if (enabled) {
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;
    const ripples = document.createElement('span');
    ripples.style.left = `${x}px`;
    ripples.style.top = `${y}px`;
    button.appendChild(ripples);
    setTimeout(() => {
      ripples.remove();
    }, 600);
    execute();
  }
});
button.addEventListener('mouseover', () => {
  if (!enabled) {
    button.style.cursor = 'not-allowed';
  } else {
    button.style.cursor = 'pointer';
  }
});
const code = document.getElementById('code');
code.addEventListener('keyup', () => {
  try {
    if (editor.getValue()) {
      JSON.parse(editor.getValue());
      button.style.opacity = '100%';
      enabled = true;
    } else {
      button.style.opacity = '50%';
      enabled = false;
    }

    document.querySelector('body > div > div.box3').style.display = 'none';
    document.querySelector('tbody').style.display = 'none';
    document.getElementById('result').innerHTML = "Paste the JSON file's content in the input box and click the button above to check for errors.<br /><br />The result will be displayed here!";
  } catch (e) {
    button.style.opacity = '50%';
    enabled = false;
    document.getElementById('result').innerHTML = `<span style="color: red;">${e.message}</span>`;
  }
});

const execute = () => checkErrors(editor.getValue())
  .then(result => {
    let diffNumber = 0;
    let diff = '';
    result.speeds.forEach(speed => {
      if (speed >= 0) diffNumber += 1;
      if (speed >= 4) diffNumber += 1;
      if (speed >= 4.7) diffNumber += 1;
      if (speed >= 6) diffNumber += 1;
      if (speed >= 6.7) diffNumber += 2;
      if (speed >= 8.4) diffNumber += 2;
      if (speed >= 9.8) diffNumber += 2;
      if (speed >= 10.5) diffNumber += 2;
      if (speed >= 12.5) diffNumber = 25;
    });
    if (result.numberOfDoubles >= 200) diffNumber += 1;
    if (result.numberOfDoubles >= 400) diffNumber += 1;
    if (result.numberOfDoubles >= 800) diffNumber += 1;
    if (result.numberOfDoubles >= 1200) diffNumber += 1;
    const hours = Number(result.duration.substring(0, result.duration.indexOf('h'))) || 0;
    const minutes = Number(result.duration.substring(0, result.duration.indexOf('m'))) || 0;

    if ((minutes >= 10 || hours >= 1) && result.numberOfDoubles >= 200) {
      diffNumber += 1;
    }

    if (diffNumber >= 0 && diffNumber < 4) {
      diff = 'Very Easy';
    } else if (diffNumber >= 4 && diffNumber < 7) {
      diff = 'Easy';
    } else if (diffNumber >= 7 && diffNumber < 10) {
      diff = 'Easy/Medium';
    } else if (diffNumber >= 10 && diffNumber < 13) {
      diff = 'Medium';
    } else if (diffNumber >= 13 && diffNumber < 16) {
      diff = 'Hard';
    } else if (diffNumber >= 16 && diffNumber < 19) {
      diff = 'Very Hard';
    } else if (diffNumber >= 19 && diffNumber < 22) {
      diff = 'Extreme';
    } else if (diffNumber >= 22 && diffNumber < 25) {
      diff = 'Legendary';
    } else if (diffNumber >= 25) {
      diff = '(?)';
    }

    const tilesInfo = [
      `<span style="color: lime;">Double tiles:</span> <span style="color: yellow;">${result.numberOfDoubles}</span>`,
      `<span style="color: lime;">Combo tiles:</span> <span style="color: yellow;">${result.numberOfCombos}</span>`,
      `<span style="color: lime;">Slide tiles:</span> <span style="color: yellow;">${result.numberOfSlides}</span>`,
      `<span style="color: lime;">Burst tiles:</span> <span style="color: yellow;">${result.numberOfBursts}</span>`,
    ];

    if (result.warnings.length > 0) {
      document.getElementById('result').innerHTML = `<span style="color: yellow;">${result.warnings.join(
        '<br />',
      )}</span>`;
    } else {
      document.getElementById('result').innerHTML = '<span style="color: lime;">NO ERRORS!</span>';
    }

    const table = document.getElementById('table');
    table.rows[0].cells[1].innerHTML = result.duration;
    table.rows[1].cells[1].innerHTML = result.score;
    table.rows[2].cells[1].innerHTML = result.score * 3;
    table.rows[3].cells[1].innerHTML = result.speeds.join('<span style="color: lime;">, </span>');
    table.rows[4].cells[1].innerHTML = result.baseBeats.join('<span style="color: lime;">, </span>');
    table.rows[5].cells[1].innerHTML = tilesInfo.join('<br />');
    table.rows[6].cells[1].innerHTML = diff;
    document.querySelector('body > div > div.box3').style.display = 'block';
    document.querySelector('tbody').style.display = 'block';
  })
  .catch(e => {
    document.getElementById('result').innerHTML = `<span style="color: red;">${e.message}</span>`;
  });
