<template>
    <div class="drag" 
        @mousedown="itemDown($event)"
        :style="style">
        <slot></slot>
        <div class="drag-select" 
            v-for="(name, index) in resizes" 
            :class="['drag-'+name]" 
            :key='index'
            @mousedown.stop.prevent="handleDown(name, $event)"></div>
    </div>
</template>
<script>
/*
    1.拖拽区域（拖拽区域位置，拖拽区域大小）
    2.
*/
export default {
    props:{
        id: {
            type: Number
        },
        minw:{
            type: Number,
            default: 10,
            validator: function (val) {
                return val > 0
            }
        },
        w: {
            type: Number,
            default: 100,
            validator: function (val) {
                return val > 0
            }
        },
        minh:{
            type: Number,
            default: 10,
            validator: function (val) {
                return val > 0
            }
        },
        h: {
            type: Number,
            default: 100,
            validator: function (val) {
                return val > 0
            }
        },
        x: {
            type: Number,
            default: 0,
            validator: function (val) {
                return typeof val === 'number'
            }
        },
        y: {
            type: Number,
            default: 0,
            validator: function (val) {
                return typeof val === 'number'
            }
        },
        z: {
            type: [String, Number],
            default: 'auto',
            validator: function (val) {
                let valid = (typeof val === 'string') ? val === 'auto' : val >= 0;
                return valid
            }
        },
    },
    data() {
        return {
            width: this.w,
            height: this.h,
            top: this.y,
            left: this.x,
            zIndex: this.z,
            moveState: false,
            resizes: ['nw','n','ne','sw','s','se','w','e'],
            dragItem: false,
            dragHandle: false,
            handleName: ''
        }
    },
    computed: {
        style(){
            return {
                top: this.top+'px',
                left: this.left+'px',
                width: this.width+'px',
                height: this.height+'px',
                zIndex: this.zIndex,
            }
        }
    },
    watch: {
        width(){

        },
        height(){

        },
        top(){
            if(this.height === 0){
                console.log('高度等于0')
            }
        },
        left(){

        }
    },
    created() {

        this.limits = {
            minLeft: null,
            maxLeft: null,
            minRight: null,
            maxRight: null,
            minTop: null,
            maxTop: null,
        };
        this.stickStartPos = { mouseX: 0, mouseY: 0, left: 0, top: 0 , width: 0, height: 0};

    },
    methods: {
        mousemove(e){

            e.stopPropagation();

            if(!this.dragItem && !this.dragHandle) return
    
            // 区域
            if(this.dragItem){
                this.itemMove(e);
            }

            // 改变大小
            if(this.dragHandle){
                this.handleMove(e);
            }

        },
        mousedown(e){
            
            e.stopPropagation();
            e.preventDefault();
            
        },
        mouseup(e){

            if(this.dragItem){
                this.itemUp();
            }
            
            if(this.dragHandle){
                this.handleUp();
            }

            this.dragItem = false;
            this.dragHandle = false;

        },
        // 点击区域
        itemDown(e){

            this.dragItem = true;
            e.stopPropagation();
            e.preventDefault();
            
            // 初始区域的 宽度 高度 left top 当前点击鼠标 x y 值先存起来
            this.stickStartPos.mouseX = e.pageX;
            this.stickStartPos.mouseY = e.pageY;
            this.stickStartPos.top = this.top;
            this.stickStartPos.left = this.left;

        },
        // 移动区域
        itemMove(e){

            const stickStartPos = this.stickStartPos;
            
            let newLeft = stickStartPos.left - (stickStartPos.mouseX - e.pageX);
            let newTop = stickStartPos.top - (stickStartPos.mouseY - e.pageY);
            
            this.left = newLeft;
            this.top = newTop;
            
        },
        // 弹起区域
        itemUp(){

            this.limits = {
                minLeft: null,
                maxLeft: null,
                minRight: null,
                maxRight: null,
                minTop: null,
                maxTop: null,
            };
            this.stickStartPos = { mouseX: 0, mouseY: 0, left: 0, top: 0 , width: 0, height: 0};

        },
        // 改变区域大小
        handleDown(name, e){

            this.dragHandle = true;
            this.handleName = name;

            // 初始区域的 宽度 高度 left top 当前点击鼠标 x y 值先存起来
            this.stickStartPos.mouseX = e.pageX;
            this.stickStartPos.mouseY = e.pageY;
            this.stickStartPos.top = this.top;
            this.stickStartPos.left = this.left;
            this.stickStartPos.width = this.width;
            this.stickStartPos.height = this.height;

        },
        handleMove(e){

            const stickStartPos = this.stickStartPos;
            let width = stickStartPos.width;
            let height = stickStartPos.height;
            
            let newTop = stickStartPos.top + (e.pageY - stickStartPos.mouseY);
            let newLeft = stickStartPos.left + (e.pageX - stickStartPos.mouseX);
            
            switch(this.handleName){
                case 'n':
                    this.height = height - (e.pageY - stickStartPos.mouseY);
                    this.top = newTop;
                    break;
                case 's':
                    this.height = height + (e.pageY - stickStartPos.mouseY);
                    break;
                case 'e':
                    this.width = width + (e.pageX - stickStartPos.mouseX);
                    break;
                case 'w':
                    this.width = width - (e.pageX - stickStartPos.mouseX);
                    this.left = newLeft;
                    break;
                case 'nw':
                    this.height = height - (e.pageY - stickStartPos.mouseY);
                    this.width = width - (e.pageX - stickStartPos.mouseX);
                    this.top = newTop;
                    this.left = newLeft;
                    break;
                case 'sw':
                    this.height = height + (e.pageY - stickStartPos.mouseY);
                    this.width = width - (e.pageX - stickStartPos.mouseX);
                    this.left = newLeft;
                    break;
                case 'ne':
                    this.height = height - (e.pageY - stickStartPos.mouseY);
                    this.width = width + (e.pageX - stickStartPos.mouseX);
                    this.top = newTop;
                    break;
                case 'se':
                    this.height = height + (e.pageY - stickStartPos.mouseY);
                    this.width = width + (e.pageX - stickStartPos.mouseX);
                    break;
            }
            
        },
        handleUp(){
            
            this.limits = {
                minLeft: null,
                maxLeft: null,
                minRight: null,
                maxRight: null,
                minTop: null,
                maxTop: null,
            };
            this.stickStartPos = { mouseX: 0, mouseY: 0, left: 0, top: 0 , width: 0, height: 0};

        }
    },
    mounted() {
        
        document.documentElement.addEventListener('mousedown', this.mousedown);
        document.documentElement.addEventListener('mousemove', this.mousemove);
        document.documentElement.addEventListener('mouseup', this.mouseup);
    
    },
}
</script>
<style lang="scss" scoped>
    .drag{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100px;
        height: 100px;
        background: red;
        &:before{
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            outline: 1px dashed #d6d6d6;
        }
        .drag-select{
            position: absolute;
            width: 8px;
            height: 8px;
            background: #ffffff;
            &.drag-nw{
                top: -4px;
                left: -4px;
                cursor:nw-resize;
            }
            &.drag-n{
                top: -4px;
                left: 50%;
                margin-left: -4px;
                cursor: n-resize;
            }
            &.drag-ne{
                top: -4px;
                right: -4px;
                cursor: ne-resize;
            }
            &.drag-sw{
                bottom: -4px;
                left: -4px;
                cursor: sw-resize;
            }
            &.drag-s{
                bottom: -4px;
                left: 50%;
                margin-left: -4px;
                cursor: s-resize;
            }
            &.drag-se{
                bottom: -4px;
                right: -4px;
                cursor: se-resize;
            }
            &.drag-w{
                top: 50%;
                left: -4px;
                margin-top: -4px;
                cursor: w-resize;
            }
            &.drag-e{
                top: 50%;
                right: -4px;
                margin-top: -4px;
                cursor: e-resize;
            }
        }
    }
</style>