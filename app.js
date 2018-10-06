const fs = require("fs");
const ffmetadata = require("ffmetadata");
const fetchVideoInfo = require('youtube-info');

var path = process.argv[2];

function getVideo(items, count){
  if(items.length == count){process.exit()}
  var file = path + '/' + items[count];
  ffmetadata.read(file, function(err, data) {
    if (err){console.error("Error reading metadata", err)};
    if(typeof data != 'undefined'){
      if(typeof data.comment != 'undefined'){
        videoId = data.comment.split('=')[1];
        fetchVideoInfo(videoId).then(function (videoInfo) {
          splittedItems = items[count].split(".");
          delete videoInfo["regionsAllowed"];
          delete videoInfo["description"];
          fs.rename(file, path + '/' + videoInfo.datePublished.replace(/-/g, '')+" "+videoInfo.title.replace(/[^\w.-\s]+/g, '')+"."+splittedItems[splittedItems.length-1], function(err) {if ( err ) console.log('ERROR: ' + err);});
          console.log("\n\n"+videoInfo.title);
          console.log(videoId+" == "+videoInfo.datePublished);
          setTimeout(function(){ getVideo(items, (count+1)), 500 });
        });
      }else{
        //console.log("\n"+items[count]+ " have no comment metadata"+"\n");
        setTimeout(function(){ getVideo(items, (count+1)), 1 });
      }
    }else{
      //console.log("\n"+items[count]+ " have no comment metadata"+"\n");
      setTimeout(function(){ getVideo(items, (count+1)), 1 });
    }
  });
}

console.log("\nRead to path: "+path+"\n")
fs.readdir(path, function(err, items) {
  getVideo(items, 0);
});
