import path from 'node:path'
import fs from 'node:fs'



// 找到项目的根目录 
// .vitepress 文件夹具有唯一性，它作为分隔符号能快速定位项目根目录
const root = __dirname.split('.vitepress')[0]


// 去除文章中的无关字符
const removeExtraContent = (content) => {
    // 移除标签代码
    content = content.replace(/<[^>]+>/g, "");
    // 移除标点符号
    content = content.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
        '');
    return content
}

// 统计图片数量
const countCharUsingRegex = (str, charToCount) => {
    const regex = new RegExp(charToCount, 'g');
    const matches = str.match(regex);
    return matches ? matches.length : 0;
}


// 获取文章的阅读时长
export const reckonReadTime = (content) => {
    // 1. 统计文章的实际字数
    // 截取文章的头部信息
    let zoend = content.indexOf('zoend')
    // 判断是否存在头部信息
    if (zoend == -1) {
        // 不存在直接处理文章
        content = removeExtraContent(content)

    } else {
        // 若是存在，从 zoend 截取，先剔除头部信息
        content = content.slice(zoend + 20)
        // 再处理文章
        content = removeExtraContent(content)
    }
    // 2. 开始统计文章的时长

    // 获取正文内容长度
    let wordcount = content.length
    // 给图片追加长度
    let pngtime = countCharUsingRegex(content, '.png')

    wordcount = wordcount + (pngtime * 150)

    // 人的阅读速度是300 - 500字 / 分钟
    // 计算阅读时间
    let readTime = wordcount / 400;
    // 取整：四舍五入
    readTime = Math.round(readTime);
    // 大于 1 分钟时
    if (readTime > 1) {
        return readTime
    } else {
        // 不足一分钟视为一分钟
        return 1
    }

}

// 生成数据库文件
export const createArticleDatabase = (Dir_selected = 'zo-articles') => {

    // 文章仓库的位置

    const repo_dir = path.resolve(root, Dir_selected)

    // 通过文件夹，读取里面的所有文章的：标题 和 编号 以及总数量

    // 检测文件夹是否存在，如果不存在不再执行后续代码
    if (!fs.existsSync(repo_dir)) {
        return
    }

    const files_all = fs.readdirSync(repo_dir)

    // 获取文章的数量
    const articlesCounts = files_all.length

    let arr = []


    for (let i = 0; i < files_all.length; i++) {
        let obj = {}

        // 添加标题、zoid数据 
        obj.zoid = files_all[i].split(' ')[0]
        obj.title = files_all[i].split(' ')[1]

        // 获取文件名称
        let nowFilename = files_all[i]

        // 添加链接
        obj.link = `/${Dir_selected}/${nowFilename.split('.md')[0]}`

        let content = fs.readFileSync(`${repo_dir}/${nowFilename}`, 'utf8')

        let res = content.indexOf('zoinfo: ')
        let res_end = content.indexOf('zoend')

        // 添加阅读时长
        obj.readTime = reckonReadTime(content)

        if (res == -1) {
            // 没有索引信息，返回基本的【zoid】和【title】
            arr.push(obj)
        } else {
            // 提取索引信息
            let info = content.slice(res + 8, res_end + 12)

            let obj2 = (new Function("return " + info))();

            arr.push(Object.assign(obj, obj2))

        }

    }

    const inforepo = path.resolve(root, `zo-data/${Dir_selected}Database.json`)

    fs.writeFileSync(inforepo, JSON.stringify(arr))

}




