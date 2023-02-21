<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TextParticleCircle } from '..'

const canvas = ref()
let ctx: any
let dots: any = []// 定义数组，用于存放后续的坐标(x,y)
let animationTimer: any
onMounted(() => {
  ctx = canvas.value.getContext('2d') as CanvasRenderingContext2D
  render()
})

function render() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  for (let m = 0; m < dots.length; m++) {
    dots[m].draw(ctx)
    if (m === dots.length - 1) {
      const percent = (Date.now() - dots[m].startTime) / dots[m].animationDuration
      if (percent > 1)
        dots = []
    }
  }
  // 动画渲染
  animationTimer = window.requestAnimationFrame(render)
}

function textToParticle(text = 'Canvas') {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  dots = []
  ctx.beginPath()
  ctx.font = '80px Arial'
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.fillText(text, 150, 150)
  ctx.fill()// 画一个文字,颜色就随意，a值尽量高点
  const img = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)// getImageData，专门用于获取图片数据，这里直接取了整个Canvas
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)// 清空画布，就是把之前的文字清空，因为后面要以粒子（应该叫小圆圈）代替
  for (let y = 0; y < img.height; y += 2) { // y+=3，是因为如果按像素取，有效值非常多，所以这里就每隔3像素取一点
    for (let x = 0; x < img.width; x += 2) { // y是高，x是宽
      // 这边就从左往右，从上往下；500X300的大小，会取166×100个像素点；×4则是因为rgba()
      // 先第一行走完，再走第二行，往下走
      const i = (x + y * img.width) * 4
      if (img.data[i + 3] >= 128) { // 因为img.data中包含了每个像素点的rgba，＋3表示取a的值
        const part = new TextParticleCircle(x, y, [0, 0, 1])
        dots.push(part)
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2, true)
        ctx.fill()
      }
    }
  }
}
function handleInput(e: any) {
  textToParticle(e.target.value)
  // window.cancelAnimationFrame(animationTimer)
}
</script>

<template>
  <canvas id="particle" ref="canvas" width="500" height="300" />

  <input
    type="text"
    @input="handleInput"
  >
</template>

<style  scoped>

</style>
