const fs = require('fs');
const glob = require('glob');

const colorMap = {
  '#0D2B5E': '#09070a',
  '#0A8F7E': '#00f0ff',
  '#D4A843': '#ffea00',
  '#14B8A1': '#00f0ff',
  '#E5BC55': '#ffea00',
  '#C29532': '#ffea00',
  '#17CBB2': '#00f0ff',
  'rgba(212,168,67,': 'rgba(255,234,0,',
  'rgba(212, 168, 67,': 'rgba(255, 234, 0,',
  'rgba(10,143,126,': 'rgba(0,240,255,',
  'rgba(10, 143, 126,': 'rgba(0, 240, 255,',
  'rgba(13,43,94,': 'rgba(9,7,10,',
  'rgba(13, 43, 94,': 'rgba(9, 7, 10,',
  'rgba(23,42,84,': 'rgba(17,14,21,',
  'rgba(23, 42, 84,': 'rgba(17, 14, 21,',
  'rgba(10,22,48,': 'rgba(9,7,10,',
  'rgba(10, 22, 48,': 'rgba(9, 7, 10,',
  'rgba(2,8,24,': 'rgba(9,7,10,',
  'rgba(2, 8, 24,': 'rgba(9, 7, 10,',
  'rgba(5, 15, 40,': 'rgba(17, 14, 21,',
  'rgba(5,15,40,': 'rgba(17,14,21,'
};

// We will only replace if the line matches `style={{...}}` or `<div` or `<button` or `<span` or `<p` or `<Html` or `className=` or `fill=` or `stroke=` or `accentColor:` or `border:` or `boxShadow:` or `background:` or `color: `. Wait, we can just replace all of them and manually revert the 3D materials. There aren't that many 3D materials.
