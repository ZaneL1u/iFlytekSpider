const uaArr = [
  "10.0; Win64; x64",
  "10.0; WOW64",
  "10.0",
  "6.2; WOW64",
  "6.2; Win64; x64",
  "6.2",
  "6.1",
  "6.1; Win64; x64",
  "6.1; WOW64",
];
const versionArr = [
  "70.0.3538.16",
  "70.0.3538.67",
  "70.0.3538.97",
  "71.0.3578.137",
  "71.0.3578.30",
  "71.0.3578.33",
  "71.0.3578.80",
  "72.0.3626.69",
  "72.0.3626.7",
  "73.0.3683.20",
  "73.0.3683.68",
  "74.0.3729.6",
  "75.0.3770.140",
  "75.0.3770.8",
  "75.0.3770.90",
  "76.0.3809.12",
  "76.0.3809.126",
  "76.0.3809.25",
  "76.0.3809.68",
  "77.0.3865.10",
  "77.0.3865.40",
  "78.0.3904.105",
  "78.0.3904.11",
  "78.0.3904.70",
  "79.0.3945.16",
  "79.0.3945.36",
  "80.0.3987.106",
  "80.0.3987.16",
  "81.0.4044.138",
  "81.0.4044.20",
  "81.0.4044.69",
  "83.0.4103.14",
  "83.0.4103.39",
  "84.0.4147.30",
  "85.0.4183.38",
  "85.0.4183.83",
  "85.0.4183.87",
  "86.0.4240.22",
  "87.0.4280.20",
  "87.0.4280.88",
  "88.0.4324.27",
];

const uploadUrl = "https://www.iflyrec.com/AudioStreamService/v1/audios";

function getCrc32checkUrl(fileid, crc32) {
  return `https://www.iflyrec.com/TranscriptOrderService/v1/tempAudios/${fileid}/initAudioInfo?crc32=${crc32}`;
}

const distinguishUrl =
  "https://www.iflyrec.com/TranscriptPreviewService/v1/aiTranscriptPreviews";

module.exports = {
  uaArr,
  versionArr,
  uploadUrl,
  getCrc32checkUrl,
  distinguishUrl,
};
