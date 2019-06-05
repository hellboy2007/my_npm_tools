var fs              = require('fs')
var path            = require("path");
const jetpack       = require('fs-jetpack');
const watch         = require('node-watch');

/**
 * 实时同步文件类
 * 将指定的目录到目标目录实时同步
 */

class SyncFiles{
    
    constructor(watchpath, targepath) {
        this.filte_all_arr      = ['.html','.css','.less','.js','.json','.tsx'];
        this.filte_asset_dir    = ['.png','.jpg','.gif','.jpeg','.bmp','.css'];
        this.watcher            = {};
        //读存路径
        this.srcpath            = watchpath;
        this.dstpath            = targepath;
    }

    /**
     * 开始监控同步文件
     */
    startWatch() {
        const self      = this;
        this.watcher    = watch(this.srcpath, { recursive: true }, function(evt, name) { });

        this.watcher.on('change', function(evt, name) {
            self.syncProjectFile(evt, name)
        });
    }

    /**
     * 停止监控
     */
    endWatch(){
        this.watcher.close();
    }
    /**
     * 
     * @param {string} evt 事件
     * @param {string} filename 来源目录或文件
     */
    syncProjectFile(evt, srcname) {

        let relativePath = path.relative(this.srcpath, srcname); // 相对路径
        let targefile      = path.join(this.dstpath, relativePath); // 响应路径或文件
        
        if(evt == 'remove') {

            jetpack.remove(targefile);

        } else if(evt == 'update') {

            // 一种是新建 一种是更新
            // 对srcpath目录进行检测以取得是文件或目录
            let flag = jetpack.exists(srcname);
            if (flag == 'file' ) {
            const extnames =  path.extname(srcname);
                if(this.filte_all_arr.includes(extnames)) {
                    // 文件操作覆盖替换 写入文件
                    jetpack.copy(srcname, targefile, { overwrite: true });
                }
            } else if ( flag == 'dir' ) {

                let srcFilesChid        = jetpack.list(srcname);        // 该文件夹是否为空 不为空有两种：1.改文件夹名，2.拷贝进来的文件夹
                let src_prev_path       = path.join(srcname,'../');     // 当前文件夹的所在目录
                let src_prev_files      = jetpack.list(src_prev_path);
                let targe_prev_path     = path.join(targefile,'../');   // 目标文件夹所在目录
                let targe_prev_files    = jetpack.list(targe_prev_path);

                if(srcFilesChid.length == 0) {
                    // 空目录
                    jetpack.copy(srcname, targefile, { overwrite: true });
                } else {
                    // 过滤拷贝开始
                    this.copyFileFromDir(srcname);
                }

                // 反检查是否有冗余文件
                targe_prev_files.filter((item) => {
                    if(!src_prev_files.includes(item)){
                        jetpack.remove(path.join(targe_prev_path, item));
                        return true;
                    }
                })
            }
        }

    }

    /**
     * 
     * @param {string} pathstr 需拷贝的文件夹
     */
    copyFileFromDir(pathstr){
        let relativePath = path.relative(this.srcpath, pathstr);		// 相对路径
        let targeDir     = path.join(this.dstpath, relativePath);	// 响应路径或文件
        if(jetpack.exists(targeDir) == false) {
            jetpack.dir(targeDir);
        }

        let nowfiles = jetpack.list(pathstr);                   // 取得当前名录下文件名称数组

        nowfiles.map((filename) => {
            let filenamestr     = path.join(pathstr,filename);
            let flag            = jetpack.exists(filenamestr);  // 文件类型
            let file_extname    = path.extname(filenamestr);    // 文件后缀
            if(flag == 'file' && this.filte_all_arr.includes(file_extname)) {
                // copy
                jetpack.copy(path.join(pathstr, filename), path.join(targeDir, filename), { overwrite: true });
            } else if(flag == 'dir') {
                this.copyFileFromDir(filenamestr);
            }
        })
    
    }

}

const srcpath        = path.join(__dirname, 'files');
const dstpath        = path.join(__dirname, 'file');
const projectWatch   = new SyncFiles(srcpath, dstpath);

projectWatch.startWatch();