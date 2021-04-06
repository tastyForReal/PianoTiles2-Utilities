let totalDurations = [];
let partTracks = [];
let lengths = [];
let allWarnings = [];
let midiBaseBeats = 0;
let doubles = 0;
let combos = 0;
let slides = 0;
let bursts = 0;

const getNote = note => {
  switch (note) {
    case 'c5':
    case 'b4':
    case '#a4':
    case 'a4':
    case '#g4':
    case 'g4':
    case '#f4':
    case 'f4':
    case 'e4':
    case '#d4':
    case 'd4':
    case '#c4':
    case 'c4':
    case 'b3':
    case '#a3':
    case 'a3':
    case '#g3':
    case 'g3':
    case '#f3':
    case 'f3':
    case 'e3':
    case '#d3':
    case 'd3':
    case '#c3':
    case 'c3':
    case 'b2':
    case '#a2':
    case 'a2':
    case '#g2':
    case 'g2':
    case '#f2':
    case 'f2':
    case 'e2':
    case '#d2':
    case 'd2':
    case '#c2':
    case 'c2':
    case 'b1':
    case '#a1':
    case 'a1':
    case '#g1':
    case 'g1':
    case '#f1':
    case 'f1':
    case 'e1':
    case '#d1':
    case 'd1':
    case '#c1':
    case 'c1':
    case 'b':
    case '#a':
    case 'a':
    case '#g':
    case 'g':
    case '#f':
    case 'f':
    case 'e':
    case '#d':
    case 'd':
    case '#c':
    case 'c':
    case 'B-1':
    case '#A-1':
    case 'A-1':
    case '#G-1':
    case 'G-1':
    case '#F-1':
    case 'F-1':
    case 'E-1':
    case '#D-1':
    case 'D-1':
    case '#C-1':
    case 'C-1':
    case 'B-2':
    case '#A-2':
    case 'A-2':
    case '#G-2':
    case 'G-2':
    case '#F-2':
    case 'F-2':
    case 'E-2':
    case '#D-2':
    case 'D-2':
    case '#C-2':
    case 'C-2':
    case 'B-3':
    case '#A-3':
    case 'A-3':
      return 7;

    case 'mute':
    case 'empty':
      return 1;

    default:
      return 0;
  }
};

const getLength = (n = '', mode = 0) => {
  let delay = 0;

  if (mode) {
    for (let i = 0; i < n.length; i += 1) {
      switch (n[i]) {
        case 'Q':
          delay += 256 * midiBaseBeats;
          break;

        case 'R':
          delay += 128 * midiBaseBeats;
          break;

        case 'S':
          delay += 64 * midiBaseBeats;
          break;

        case 'T':
          delay += 32 * midiBaseBeats;
          break;

        case 'U':
          delay += 16 * midiBaseBeats;
          break;

        case 'V':
          delay += 8 * midiBaseBeats;
          break;

        case 'W':
          delay += 4 * midiBaseBeats;
          break;

        case 'X':
          delay += 2 * midiBaseBeats;
          break;

        case 'Y':
          delay += 1 * midiBaseBeats;
          break;

        default:
          return 0;
      }
    }
  } else {
    for (let i = 0; i < n.length; i += 1) {
      switch (n[i]) {
        case 'H':
          delay += 256 * midiBaseBeats;
          break;

        case 'I':
          delay += 128 * midiBaseBeats;
          break;

        case 'J':
          delay += 64 * midiBaseBeats;
          break;

        case 'K':
          delay += 32 * midiBaseBeats;
          break;

        case 'L':
          delay += 16 * midiBaseBeats;
          break;

        case 'M':
          delay += 8 * midiBaseBeats;
          break;

        case 'N':
          delay += 4 * midiBaseBeats;
          break;

        case 'O':
          delay += 2 * midiBaseBeats;
          break;

        case 'P':
          delay += 1 * midiBaseBeats;
          break;

        default:
          return 0;
      }
    }
  }

  return delay;
};

const parseTrack = (score = '', fullJson = '', partNum = 0, trkNum = 0) => {
  const trackLength = [];
  const warnings = [];
  const allNotes = [];
  let mode = 0;
  let double = 0;
  let combo = 0;
  let slide = 0;
  let notes = [];
  let slideLengths = [];
  let data = score;
  let tile = '';
  let tileUnclosed = false;
  let curlyBracketUnclosed = '';
  let err = '';

  if (data) {
    if (
      (data.endsWith(']')
        || data.endsWith('}')
        || data.endsWith('>')
        || data.endsWith('Q')
        || data.endsWith('R')
        || data.endsWith('S')
        || data.endsWith('T')
        || data.endsWith('U')
        || data.endsWith('V')
        || data.endsWith('W')
        || data.endsWith('X')
        || data.endsWith('Y'))
      && (!data.endsWith(',') || !data.endsWith(';'))
    ) {
      warnings.push(`[PART ${partNum}]: Track ${trkNum} doesn't end with , or ;`);
      data += ',';
    }
  } else {
    throw new Error('Track empty!');
  }

  for (let i = 0; i < data.length; i += 1) {
    const pos = fullJson.indexOf(score) + i;

    if (data[i] === '.') {
      if (mode === 2) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }
    } else if (data[i] === '~' || data[i] === '$') {
      if (mode === 2) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }

      notes.push(2);
    } else if (data[i] === '@') {
      if (mode === 2) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }

      notes.push(3);
    } else if (data[i] === '%') {
      if (mode === 2) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }

      notes.push(4);
    } else if (data[i] === '!') {
      if (mode === 2) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }

      notes.push(5);
    } else if (data[i] === '^' || data[i] === '&') {
      if (mode === 2) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }

      notes.push(6);
    } else if (data[i] === '(') {
      if (mode === 0) {
        mode = 1;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }
    } else if (data[i] === ')') {
      if (mode === 2) {
        mode = 3;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }
    } else if (data[i] === '[') {
      if (mode === 3) {
        mode = 4;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }
    } else if (data[i] === ']') {
      if (mode === 6) {
        mode = 5;
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }
    } else if (data[i] === ',' || data[i] === ';') {
      if (mode === 5) {
        mode = 0;
      } else if (mode === 0) {
        warnings.push(`Duplicated , or ; at positon ${pos}`);
      } else {
        err = `Unexpected ${data[i]} at position ${pos}`;
        throw new Error(err);
      }
    } else {
      if (data[i] === ' ') {
        warnings.push(`[PART ${partNum}]: Track ${trkNum} has space at position ${pos}`);
        continue;
      }

      if (data[i] === '{' && mode === 5) {
        if (!curlyBracketUnclosed) {
          curlyBracketUnclosed += data[i];
        }

        continue;
      }

      if (curlyBracketUnclosed) {
        if (data[i] >= 0 && data[i] <= 9) {
          curlyBracketUnclosed += data[i];
          continue;
        } else if (data[i] !== '}') {
          err = `Unexpected ${curlyBracketUnclosed} at position ${
            fullJson.indexOf(score) + data.indexOf(curlyBracketUnclosed)
          }`;
          throw new Error(err);
        }
      }

      if (data[i] === '}' && mode === 5) {
        if (curlyBracketUnclosed) {
          curlyBracketUnclosed = '';
        }

        continue;
      }

      if (data[i] >= 0 && data[i] <= 9 && mode === 0) {
        if (!tile) {
          tile += data[i];
          tileUnclosed = true;
        }

        continue;
      }

      if (data[i] === '<' && mode === 0) {
        tile += data[i];
        continue;
      }

      if (tile) {
        switch (tile) {
          case '2<':
            tile = '';
            break;

          case '3<':
            if (!combo) {
              combo = 1;
            }

            combos += 1;
            tile = '';
            break;

          case '5<':
            if (!double) {
              double = 1;
            }

            doubles += 1;
            tile = '';
            break;

          case '6<':
            tile = '';
            break;

          case '7<':
          case '8<':
            if (!slide) {
              slide = 1;
            }

            slides += 1;
            tile = '';
            break;

          case '9<':
            tile = '';
            break;

          case '10<':
            bursts += 1;
            tile = '';
            break;

          default:
            err = `Unexpected ${tile} at position ${fullJson.indexOf(score) + data.indexOf(tile)}`;
            throw new Error(err);
        }
      }

      if (data[i] === '>' && mode === 5) {
        if (tileUnclosed) {
          tileUnclosed = false;
        }

        if (combo) {
          combo = 0;
        }

        if (double === 2) {
          double = 0;
        }

        if (slide) {
          allNotes.push([1, slideLengths.reduce((a, b) => a + b, 0)]);
          slideLengths = [];
          slide = 0;
        }

        continue;
      }

      let temp = '';

      for (;;) {
        temp += data[i];
        i += 1;

        if (
          i === data.length - 1
          || data[i] === '.'
          || data[i] === '('
          || data[i] === ')'
          || data[i] === '~'
          || data[i] === '['
          || data[i] === ']'
          || data[i] === ','
          || data[i] === ';'
          || data[i] === '<'
          || data[i] === '>'
          || data[i] === '@'
          || data[i] === '%'
          || data[i] === '!'
          || data[i] === '$'
          || data[i] === '^'
          || data[i] === '&'
        ) {
          i -= 1;
          break;
        }
      }

      const note = getNote(temp);
      const length = getLength(temp, 0);
      const rest = getLength(temp, 1);

      if (note) {
        if (mode === 0) {
          mode = 3;
        } else if (mode === 1) {
          mode = 2;
        } else {
          throw new Error('There was an unknown error parsing note!');
        }

        if (note !== 1) {
          notes.push(note);
        }
      } else if (length) {
        if (mode === 4) {
          mode = 6;
        } else {
          throw new Error('There was an unknown error parsing note length!');
        }

        trackLength.push(length);

        if (!combo && !double && !slide) {
          allNotes.push([1, length]);
        } else if (combo === 1) {
          allNotes.push([2, 0]);
        } else if (double === 1) {
          allNotes.push([1, 0]);
          double = 2;
        } else if (slide === 1) {
          slideLengths.push(length);
        }

        const tuplets = notes.filter(x => x === 2).length;
        const arp1 = notes.filter(x => x === 3).length;
        const arp2 = notes.filter(x => x === 4).length;
        const arp3 = notes.filter(x => x === 5).length;
        const ornament = notes.filter(x => x === 6).length;

        if (
          (tuplets > 0 ? 1 : 0)
            + (arp1 > 0 ? 1 : 0)
            + (arp2 > 0 ? 1 : 0)
            + (arp3 > 0 ? 1 : 0)
            + (ornament > 0 ? 1 : 0)
          > 1
        ) {
          throw new Error(`Mixed operators at positon ${pos}`);
        }

        let delay = 0;

        if (arp1) {
          if (arp1 === 1) {
            delay = length / 10;
          } else {
            delay = length / (10 * (arp1 - 1));
          }

          if (delay > length) {
            throw new Error(`Fatal error with @ at positon ${pos}`);
          }
        } else if (arp2) {
          delay = (3 * length) / (10 * arp2);

          if (delay > length) {
            throw new Error(`Fatal error with % at positon ${pos}`);
          }
        } else if (arp3) {
          delay = (3 * length) / (20 * arp3);

          if (delay > length) {
            throw new Error(`Fatal error with ! at positon ${pos}`);
          }
        } else if (ornament) {
          if (notes.length !== 3 || Number(notes[1]) !== 6 || Number(notes[0]) < 6 || Number(notes[2]) < 6) {
            throw new Error(`There was a problem with ornament at positon ${pos}`);
          }
        }

        notes = [];
      } else if (rest) {
        if (mode === 0) {
          trackLength.push(rest);

          if (!combo && !double && !slide) {
            allNotes.push([0, rest]);
          } else if (combo === 1) {
            allNotes.push([2, 0]);
          } else if (double === 1) {
            allNotes.push([1, 0]);
            double = 2;
          } else if (slide === 1) {
            slideLengths.push(rest);
          }

          mode = 5;
        } else if (mode === 1) {
          warnings.push(
            `Rest "${temp}" at position ${pos} is inside the parenthesis! You should convert it into 'mute'.`,
          );
          mode = 2;
        } else {
          throw new Error('There was an unknown error parsing rest!');
        }
      } else {
        throw new Error(`Couldn't parse "${temp}" at position ${pos}`);
      }
    }
  }

  if (mode !== 0 && mode !== 5) {
    throw new Error('There was an unknown error checking track!');
  }

  if (tileUnclosed) {
    throw new Error(`Unclosed tile! (Position ${fullJson.indexOf(score) + data.indexOf(tile)})`);
  }

  if (curlyBracketUnclosed) {
    throw new Error(
      `Unclosed curly bracket! (Position ${fullJson.indexOf(score) + data.indexOf(curlyBracketUnclosed)})`,
    );
  }

  partTracks.push({
    scores: allNotes,
  });
  lengths.push(trackLength.reduce((a, b) => a + b, 0));
  allWarnings.push(...warnings);
};

const checkBaseBeats = parsedBaseBeats => {
  switch (parsedBaseBeats) {
    case 15:
      midiBaseBeats = 1;
      break;

    case 7.5:
      midiBaseBeats = 2;
      break;

    case 5:
      midiBaseBeats = 3;
      break;

    case 3.75:
      midiBaseBeats = 4;
      break;

    case 3:
      midiBaseBeats = 5;
      break;

    case 2.5:
      midiBaseBeats = 6;
      break;

    case 1.875:
      midiBaseBeats = 8;
      break;

    case 1.5:
      midiBaseBeats = 10;
      break;

    case 1.25:
      midiBaseBeats = 12;
      break;

    case 1:
      midiBaseBeats = 15;
      break;

    case 0.9375:
      midiBaseBeats = 16;
      break;

    case 0.75:
      midiBaseBeats = 20;
      break;

    case 0.625:
      midiBaseBeats = 24;
      break;

    case 0.5:
      midiBaseBeats = 30;
      break;

    case 0.46875:
      midiBaseBeats = 32;
      break;

    case 0.375:
      midiBaseBeats = 40;
      break;

    case 0.3125:
      midiBaseBeats = 48;
      break;

    case 0.25:
      midiBaseBeats = 60;
      break;

    case 0.234375:
      midiBaseBeats = 64;
      break;

    case 0.1875:
      midiBaseBeats = 80;
      break;

    case 0.15625:
      midiBaseBeats = 96;
      break;

    case 0.125:
      midiBaseBeats = 120;
      break;

    case 0.1171875:
      midiBaseBeats = 128;
      break;

    case 0.09375:
      midiBaseBeats = 160;
      break;

    case 0.078125:
      midiBaseBeats = 192;
      break;

    case 0.0625:
      midiBaseBeats = 240;
      break;

    case 0.05859375:
      midiBaseBeats = 256;
      break;

    case 0.046875:
      midiBaseBeats = 320;
      break;

    case 0.0390625:
      midiBaseBeats = 384;
      break;

    case 0.03125:
      midiBaseBeats = 480;
      break;

    case 0.029296875:
      midiBaseBeats = 512;
      break;

    case 0.0234375:
      midiBaseBeats = 640;
      break;

    case 0.01953125:
      midiBaseBeats = 768;
      break;

    case 0.015625:
      midiBaseBeats = 960;
      break;

    default:
      throw new Error('Wrong baseBeats value!');
  }
};

const getDurationText = number => {
  const Tuple = a => b => ({
    type: 'Tuple',
    0: a,
    1: b,
    length: 2,
  });

  const weekParts = intSeconds => [0, 7, 24, 60, 60].reduceRight((a, x) => {
    const r = a[0];
    const mod = x !== 0 ? r % x : r;
    return Tuple((r - mod) / (x || 1))([mod].concat(a[1]));
  }, Tuple(intSeconds)([]))[1];

  const compoundDuration = labels => intSeconds => weekParts(intSeconds)
    .map((v, i) => [v, labels[i]])
    .reduce((a, x) => a.concat(x[0] ? [`${x[0]}${x[1] || '?'}`] : []), [])
    .join(' ');

  return compoundDuration(['w', 'd', 'h', 'm', 's'])(number);
};

const getPoints = (length, songBaseBeats, midBaseBeats) => {
  const tileLength = (length * (0.03125 / songBaseBeats)) / midBaseBeats;
  let m = tileLength % 1;

  if (tileLength === 1 && m === 0) {
    m = 0;
  } else if (tileLength < 1.5 && tileLength > 1) {
    m = 1;
  } else if (tileLength < 2 && tileLength >= 1.5) {
    m = 2;
  }

  if (tileLength === 2) {
    m = 1;
  } else if (tileLength > 2 && m < 0.5) {
    m = 1;
  } else if ((tileLength > 2 && m >= 0.5) || (tileLength > 2 && m < 1)) {
    m = 2;
  }

  return Math.trunc(tileLength) + m;
};

const checkErrors = data => new Promise((resolve, reject) => {
  const json = data;
  const arraySpeeds = [];
  const allBaseBeats = [];
  const trackLengths = [];
  const allPoints = [0, 0, 0];
  const firstTracks = [];
  const songData = {
    parts: [],
  };
  let durationInSeconds = '';
  let durationText = '';
  let pointsPerRound = 0;
  let jsonData = {};

  try {
    jsonData = JSON.parse(json);
  } catch (err) {
    reject(new Error(err.message));
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(jsonData, 'baseBpm')) {
    reject(new Error('"baseBpm" in JSON file is missing!'));
    return;
  }

  if (typeof jsonData.baseBpm !== 'number') {
    reject(new Error('"baseBpm" in JSON file is not a number!'));
    return;
  }

  if (Object.prototype.hasOwnProperty.call(jsonData, 'musics')) {
    const arrMusics = jsonData.musics;

    if (!Array.isArray(arrMusics)) {
      reject(new Error('"musics" is not an array!'));
      return;
    }

    let songBpm = 0.0;
    let songBaseBeats = 0.0;
    let partN = 1;
    const id = [];
    arrMusics.forEach(part => {
      try {
        let scoreId = 0;
        let trackN = 1;
        const tracks = part.scores;
        id.push(tracks);

        if (Object.prototype.hasOwnProperty.call(part, 'id')) {
          scoreId = part.id;

          if (typeof scoreId !== 'number') {
            throw new Error('"id" value is not a number!');
          }

          if (scoreId !== partN) {
            throw new Error(`Expected "id" value to be ${partN}, but got ${scoreId}`);
          }
        } else {
          throw new Error('"id" is missing!');
        }

        if (Object.prototype.hasOwnProperty.call(part, 'bpm')) {
          songBpm = part.bpm;

          if (typeof songBpm !== 'number') {
            throw new Error('"bpm" value is not a number!');
          }
        } else {
          throw new Error('"bpm" is missing!');
        }

        if (Object.prototype.hasOwnProperty.call(part, 'baseBeats')) {
          songBaseBeats = part.baseBeats;

          if (typeof songBaseBeats !== 'number') {
            throw new Error('"baseBeats" value is not a number!');
          }
        } else {
          throw new Error('"baseBeats" is missing!');
        }

        checkBaseBeats(songBaseBeats);
        arraySpeeds.push((songBpm / songBaseBeats / 60).toFixed(3));
        allBaseBeats.push(songBaseBeats);

        if (!Array.isArray(tracks)) {
          throw new Error('"scores" is not an array!');
        }

        if (!tracks.length) {
          throw new Error('No tracks.');
        }

        tracks.forEach(currentTrack => {
          const track = currentTrack;

          try {
            if (typeof track !== 'string') {
              throw new Error(`Incorrect track type: '${typeof track}'`);
            }

            parseTrack(track, json, partN, trackN);

            if (trackN === 1) {
              firstTracks.push(track);
            }
          } catch (err) {
            throw new Error(`Track ${trackN}: ${err.message}`);
          }

          if (trackN === tracks.length) {
            trackLengths.push(lengths);
            songData.parts.push({
              tracks: partTracks,
            });
            lengths = [];
            partTracks = [];
          }

          trackN += 1;
        });
        trackLengths.forEach(length => {
          length.forEach((currentLength, num) => {
            const diff = Number(length[0]) - Number(currentLength);

            if (diff > 0) {
              allWarnings.push(
                `[PART ${partN}]: Track ${num + 1} is shorter than the first track (${diff} ticks)`,
              );
            } else if (diff < 0) {
              allWarnings.push(`[PART ${partN}]: Track ${num + 1} is too long (${diff} ticks)`);
            }
          });
          trackLengths.shift();
        });

        if (Object.prototype.hasOwnProperty.call(part, 'instruments')) {
          if (!Array.isArray(part.instruments)) {
            throw new Error('"instruments" is not an array!');
          }

          if (part.scores > part.instruments.length) {
            throw new Error('"scores" aren\'t equal to number of "instruments"!');
          }

          let instNum = 0;
          part.instruments.forEach(inst => {
            if (typeof inst !== 'string') {
              throw new Error(`Instrument ${instNum + 1} is not a string type!`);
            }

            if (!inst && typeof part.scores[instNum] !== 'undefined') {
              allWarnings.push(`[PART ${partN}]: Instrument ${instNum + 1} has no name!`);
            }

            instNum += 1;
          });
        }

        if (Object.prototype.hasOwnProperty.call(part, 'alternatives')) {
          if (!Array.isArray(part.alternatives)) {
            throw new Error('"alternatives" is not an array!');
          }

          let altNum = 0;
          part.alternatives.forEach(inst => {
            if (typeof inst !== 'string' && inst !== null) {
              throw new Error(`Alternative instrument ${altNum + 1} is not a string type!`);
            }

            altNum += 1;
          });
        }
      } catch (err) {
        reject(new Error(`[PART ${partN}]: ${err.message}`));
        return;
      }

      partN += 1;
    });
    songData.parts.forEach(part => {
      part.tracks[0].scores.forEach(score => {
        if (score[0] === 1 && score[1] > 0) {
          allPoints[1] += getPoints(score[1], songBaseBeats, midiBaseBeats);
        } else if (score[0] === 1 && score[1] === 0) {
          allPoints[0] += 4;
        } else if (score[0] === 2 && score[1] === 0) {
          allPoints[0] += 1;
        }
      });
    });
    const allBgPoints = firstTracks.map((firstTrack, i) => {
      let firstTrackBg = firstTrack
        .replace(/;/g, ',')
        .replace(/,,/g, ',')
        .replace(/empty|mute|[\d!#$%&().@A-G[\]a-g{|}~^-]/g, '')
        .replace(/[<>]/g, '|')
        .replace(/P/g, 'P'.repeat(1))
        .replace(/O/g, 'P'.repeat(2))
        .replace(/N/g, 'P'.repeat(4))
        .replace(/M/g, 'P'.repeat(8))
        .replace(/L/g, 'P'.repeat(16))
        .replace(/K/g, 'P'.repeat(32))
        .replace(/J/g, 'P'.repeat(64))
        .replace(/I/g, 'P'.repeat(128))
        .replace(/H/g, 'P'.repeat(256))
        .replace(/Y/g, 'Y'.repeat(1))
        .replace(/X/g, 'Y'.repeat(2))
        .replace(/W/g, 'Y'.repeat(4))
        .replace(/V/g, 'Y'.repeat(8))
        .replace(/U/g, 'Y'.repeat(16))
        .replace(/T/g, 'Y'.repeat(32))
        .replace(/S/g, 'Y'.repeat(64))
        .replace(/R/g, 'Y'.repeat(128))
        .replace(/Q/g, 'Y'.repeat(256))
        .split('|');

      for (let j = 1; j < firstTrackBg.length; j += 2) {
        firstTrackBg[j] = firstTrackBg[j].replace(/Y/g, 'P');
        firstTrackBg[j] = firstTrackBg[j].replace(/,/g, '');
      }

      firstTrackBg = firstTrackBg.join('');
      firstTrackBg = firstTrackBg.split(',').filter(r => r);

      for (let j = 1; j < id[i].length; j += 1) {
        let newId = id[i][j]
          .replace(/;/g, ',')
          .replace(/,,/g, ',')
          .replace(/empty|mute|[\d!#$%&().<>@A-G[\]a-g{|}~^-]/g, '')
          .replace(/,,/g, ',')
          .replace(/P/g, 'P'.repeat(1))
          .replace(/O/g, 'P'.repeat(2))
          .replace(/N/g, 'P'.repeat(4))
          .replace(/M/g, 'P'.repeat(8))
          .replace(/L/g, 'P'.repeat(16))
          .replace(/K/g, 'P'.repeat(32))
          .replace(/J/g, 'P'.repeat(64))
          .replace(/I/g, 'P'.repeat(128))
          .replace(/H/g, 'P'.repeat(256))
          .replace(/Y/g, 'Y'.repeat(1))
          .replace(/X/g, 'Y'.repeat(2))
          .replace(/W/g, 'Y'.repeat(4))
          .replace(/V/g, 'Y'.repeat(8))
          .replace(/U/g, 'Y'.repeat(16))
          .replace(/T/g, 'Y'.repeat(32))
          .replace(/S/g, 'Y'.repeat(64))
          .replace(/R/g, 'Y'.repeat(128))
          .replace(/Q/g, 'Y'.repeat(256))
          .split(',');

        for (let k = 0; k < newId.length; k += 1) {
          newId[k] = newId[k].replace(/Y/g, '0,');

          if (newId[k].indexOf('P') === 0) {
            newId[k] = newId[k].replace(/P/g, '0,');
            newId[k] = `1,${newId[k].substring(2)}`;
          }
        }

        newId = newId.join('');
        newId = newId.split(',');

        for (let k = 0; k < newId.length; k += 1) {
          newId[k] = Number(newId[k]);

          if (Number.isNaN(newId[k])) {
            newId[k] = 0;
          }
        }

        id[i][j] = newId;
      }

      id[i].shift();

      let idBg = _.unzipWith(id[i], _.add);

      for (let j = 0; j < idBg.length; j += 1) {
        if (idBg[j] > 0) {
          idBg[j] = 1;
        }
      }

      idBg = idBg.join('');

      for (let j = 0; j < firstTrackBg.length; j += 1) {
        if (firstTrackBg[j].includes('Y')) {
          firstTrackBg[j] = `|${firstTrackBg[j]}|`;
        }
      }

      firstTrackBg = firstTrackBg.join('');
      firstTrackBg = firstTrackBg.replace(/\|\|/g, '|');
      firstTrackBg = firstTrackBg.split('|');
      const array = [];

      for (let j = 0; j < firstTrackBg.length; j += 1) {
        const k = firstTrackBg[j].length;
        firstTrackBg[j] = firstTrackBg[j].replace(/P/g, '2');
        firstTrackBg[j] = firstTrackBg[j].replace(/Y/g, '0');
        idBg = `${idBg.substring(0, k)},${idBg.substring(k)}`;
        idBg = idBg.split(',');
        array.push(idBg[0]);
        idBg = idBg[1];
      }

      for (let j = 0; j < firstTrackBg.length; j += 1) {
        if (firstTrackBg[j].includes('2')) {
          firstTrackBg[j] = firstTrackBg[j].replace(/2/g, '');
        } else if (firstTrackBg[j].includes('0') && array[j].includes('1')) {
          firstTrackBg[j] = firstTrackBg[j].replace(/0/g, 'P');
        } else {
          firstTrackBg[j] = '';
        }
      }

      const firstTrackBgNew = firstTrackBg.map(({ length }) => getPoints(length, songBaseBeats, 1));
      firstTrackBg = firstTrackBgNew;
      let normalFirstTrackCalc = 0;

      for (let j = 0; j < firstTrackBg.length; j += 1) {
        normalFirstTrackCalc += firstTrackBg[j];
      }

      return normalFirstTrackCalc;
    });
    allPoints[2] = allBgPoints.reduce((a, b) => a + b, 0);
    pointsPerRound = allPoints.reduce((a, b) => a + b, 0);
    totalDurations.push(
      ...[].concat(
        firstTracks.map(t => {
          const p = t
            .replace(/empty|mute|[\d!#$%&(),.;<>@A-G[\]a-g{}~^-]/g, '')
            .replace(/Q/g, 'RR')
            .replace(/R/g, 'SS')
            .replace(/S/g, 'TT')
            .replace(/T/g, 'UU')
            .replace(/U/g, 'VV')
            .replace(/V/g, 'WW')
            .replace(/W/g, 'XX')
            .replace(/X/g, 'YY')
            .replace(/Y/g, 'P')
            .replace(/H/g, 'II')
            .replace(/I/g, 'JJ')
            .replace(/J/g, 'KK')
            .replace(/K/g, 'LL')
            .replace(/L/g, 'MM')
            .replace(/M/g, 'NN')
            .replace(/N/g, 'OO')
            .replace(/O/g, 'PP');
          return (p.match(/P/g) || []).length;
        }),
      ),
    );
    durationInSeconds = Math.round(
      totalDurations
        .map((n, i) => (n * (0.03125 / allBaseBeats[i])) / arraySpeeds[i])
        .reduce((a, b) => a + b, 0),
    );
  } else {
    reject(new Error('"musics" in JSON file is missing!'));
    return;
  }

  if (Object.prototype.hasOwnProperty.call(jsonData, 'audition')) {
    if (jsonData.audition.constructor !== Object) {
      reject(new Error('"audition" in JSON file is not an object!'));
      return;
    }

    if (Object.prototype.hasOwnProperty.call(jsonData.audition, 'start')) {
      if (!Array.isArray(jsonData.audition.start)) {
        if (jsonData.audition.start !== null) {
          reject(new Error('JSON: "start" inside "audition" object is not an array!'));
          return;
        }
      } else {
        if (typeof jsonData.audition.start[0] !== 'number') {
          reject(new Error('JSON: First element in "start" inside "audition" is not a number.'));
          return;
        }

        if (typeof jsonData.audition.start[1] !== 'number') {
          reject(new Error('JSON: Second element in "start" inside "audition" is not a number.'));
          return;
        }
      }
    } else {
      allWarnings.push('JSON: "start" inside "audition" object is missing!');
    }

    if (Object.prototype.hasOwnProperty.call(jsonData.audition, 'end')) {
      if (!Array.isArray(jsonData.audition.end)) {
        if (jsonData.audition.end !== null) {
          reject(new Error('JSON: "end" inside "audition" object is not an array!'));
          return;
        }
      } else {
        if (typeof jsonData.audition.end[0] !== 'number') {
          reject(new Error('JSON: First element in "end" inside "audition" is not a number.'));
          return;
        }

        if (typeof jsonData.audition.end[1] !== 'number') {
          reject(new Error('JSON: Second element in "end" inside "audition" is not a number.'));
          return;
        }
      }
    } else {
      allWarnings.push('JSON: "end" inside "audition" object is missing!');
    }
  }

  const warningsText = [];

  if (allWarnings.length > 0) {
    allWarnings = allWarnings.map(warning => `- ${warning}`);
    warningsText.push('========= WARNINGS: =========', '', ...allWarnings, '');
  }

  durationText = getDurationText(durationInSeconds);

  if (!durationText) {
    durationText = 'Less than 1s';
  }

  const result = {
    warnings: warningsText,
    speeds: arraySpeeds,
    baseBeats: allBaseBeats,
    numberOfDoubles: doubles,
    numberOfCombos: combos,
    numberOfSlides: slides,
    numberOfBursts: bursts,
    score: pointsPerRound,
    duration: durationText,
  };
  totalDurations = [];
  partTracks = [];
  lengths = [];
  allWarnings = [];
  midiBaseBeats = 0;
  doubles = 0;
  combos = 0;
  slides = 0;
  bursts = 0;
  resolve(result);
});