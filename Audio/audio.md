## API

属性 | 说明 | 类型 | 默认值
------|------|------|------
 head  |   图片头像    |    String      |   无
 intro  |   音频信息（歌名等）    |    String      |   无
 playurl  |   音频链接    |    String      |   无
 duration  |   音频时长（单位：秒）    |    Number      |   0



### 基于react-player封装的精简版音频播放器，自由搭配，开箱即用

### 支持播放、缓冲等状态获取、可拖拽进度条、自定义样式、独占播放等

---
####自定义样式通过参数获取各个信息，如下调用：
```javascript
const audioData = {
   head: "",
   intro: '歌名',
*  playurl: "", 
   duration: 248,
}

<Audio {...audioDate}>
  {
    ({
      onPlay, // fn 可传参布尔值控制播放暂停 onPlay(true)或onPlay(false) onPlay()为自动转换状态 
      playing, // Boolean 播放状态
      buffer, // Boolean 是否缓冲中
      currentTime, // Num/string 已播放时间
      backgroundsize, // Num/string 播放进度百分比
    }) => (<div>...</div>)
  }
</Audio>
```
#### 或 直接使用默认样式
```javascript
<Audio {...audioDate} />
```