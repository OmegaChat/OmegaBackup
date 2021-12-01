import fs from "fs";

const indexFoler = (path: string) => {
  const volumes: string[] = [];
  let done = 0
  return new Promise((res) => {
    fs.readdir(path, {}, (_, files) => {
      if (files) {
        files.forEach((file) => {
          fs.stat(path + file, {}, (_, stats) => {
            if (!stats.isFile()) {
              volumes.push(file.toString());
            }
            done += 1
            if (done === files.length) {
              res(volumes);
            }
          })
        })
      }
    });
  })
};

indexFoler("/Volumes/").then((volumes) => {
  console.log(volumes);
})