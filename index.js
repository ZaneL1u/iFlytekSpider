const {
  upload,
  crc32check,
  distinguish
} = require("./distinguish");

async function doDistinguish() {
  await upload(
    "https://636c-cloud1-3g8ehgqf591a46a8-1306163804.tcb.qcloud.la/ljwx/cb1451ad-7d31-484d-b145-934618244ea5_34.mp4"
  );

  /**
  const {
    data: {
      desc,
      biz: {
        fileId,
        crc32,
        transPreviewPath,
        uploadedSize
      }
    }
  } = await upload("./assets/download.mp4")
  if (desc === 'success' && !(typeof uploadedSize === 'number'))
    throw new Error("upload failed");
  if (await crc32check(fileId, crc32)) {
    await distinguish(transPreviewPath)
    const interval = setInterval(async () => {
      let {
        biz: {
          transcriptResult
        }
      } = await distinguish(transPreviewPath, 'get')
      if (transcriptResult) {
        console.log(JSON.parse(transcriptResult))
        clearInterval(interval)
      }
    }, 3000)
  }
  */

}

doDistinguish()