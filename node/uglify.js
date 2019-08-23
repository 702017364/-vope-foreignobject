import fs from 'fs';
import {minify} from 'uglify-es';
import through2 from 'through2';
import gutil from 'gulp-util';

export default () => {
  return through2.obj((file, enc, cb) => {
    if(file.isNull()){
      return cb(null, file);
    }
    const src = file.path;
    if(!fs.existsSync(src)){
      throw new Error('file ' + src + ' no exist');
    }
    let content = fs.readFileSync(src, {
      encoding: 'utf8',
    });
    content = minify(content, {
      toplevel: true,
    }).code;
    file.contents = Buffer.from(content);
    file.path = gutil.replaceExtension(src, '.js');
    cb(null, file);
  });
};