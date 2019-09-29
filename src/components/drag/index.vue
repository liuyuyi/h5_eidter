<template>
    <div class="drag" 
        :class="active ? 'active' : 'unActive' "
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
*/
export default {
    props:{
        isActive: {
            type: Boolean, default: false
        },
        id: {
            type: Number
        },
        parentW:{
            type: Number,
        },
        parentH:{
            type: Number,
        },
        minWidth:{
            type: Number,
            default: 10,
            validator: function (val) {
                return val > 0
            }
        },
        minHeight:{
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
            active: this.isActive,
            rawWidth: this.w,
            rawHeight: this.h,
            rawTop: this.y,
            rawLeft: this.x,
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
        rawWidth(newWidth){

            const stickStartPos = this.stickStartPos;
            
            if(newWidth < this.minWidth){
                newWidth = this.minWidth;
            }
            // 限制拖拽左侧3个点 的范围
            else if(newWidth > stickStartPos.maxWidth 
            && (this.handleName === 'w' || this.handleName === 'nw' ||  this.handleName === 'sw')){
                newWidth = stickStartPos.maxWidth;
            }
            // 限制拖拽右侧3个点 的范围
            else if(newWidth > (this.parentW - this.left) &&
            (this.handleName === 'e' || this.handleName === 'ne' ||  this.handleName === 'se')){
                newWidth = this.parentW - this.left;
            }
            
            this.width = newWidth;

        },
        rawHeight(newHeight){
            
            const stickStartPos = this.stickStartPos;

            if(newHeight < this.minHeight){
                newHeight = this.minHeight;
            }
            // 限制拖拽顶部3个点 的范围
            else if(newHeight > stickStartPos.maxHeight &&
            (this.handleName === 'n' || this.handleName === 'nw' ||  this.handleName === 'ne')){
                newHeight = stickStartPos.maxHeight;
            }
            // 限制拖拽低部3个点 的范围
            else if(newHeight > (this.parentH - this.top) &&
            (this.handleName === 's' || this.handleName === 'sw' ||  this.handleName === 'se')){
                newHeight = this.parentH - this.top;
            }

            this.height = newHeight;
            
        },
        rawTop(newTop){

            const limits = this.limits;
            
            if(limits.maxTop !== null && newTop > limits.maxTop){
                newTop = limits.maxTop;
            }else if(limits.minTop !== null && newTop < limits.minTop){
                newTop = limits.minTop;
            }

            this.top = newTop;

        },
        rawLeft(newLeft){

            const limits = this.limits;
            
            if(limits.maxLeft !== null && newLeft > limits.maxLeft){
                newLeft = limits.maxLeft;
            }else if(limits.minLeft !== null && newLeft < limits.minLeft){
                newLeft = limits.minLeft;
            }
            
            this.left = newLeft;

        },
        active(val){
            if(val){
                this.$emit('actived');
            }else{
                this.$emit('unactived');
            }
        }
    },
    created() {

        this.limits = {
            minLeft: null,
            maxLeft: null,
            minTop: null,
            maxTop: null,
        };
        this.stickStartPos = { mouseX: 0, mouseY: 0, left: 0, top: 0 , width: 0, height: 0, maxWidth:0, maxHeight: 0};

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

            this.active = false;
            
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

            this.active = true;

        },
        // 移动区域
        itemMove(e){

            const stickStartPos = this.stickStartPos;
            
            let newLeft = stickStartPos.left - (stickStartPos.mouseX - e.pageX);
            let newTop = stickStartPos.top - (stickStartPos.mouseY - e.pageY);
            
            // 限制区域移动禁止超出范围
            if(newTop < 0){
                newTop = 0;
            }else if((this.parentH - this.height) < newTop){
                newTop = this.parentH - this.height;
            }

            if(newLeft < 0){
                newLeft = 0;
            }else if(newLeft > (this.parentW - this.width)){
                newLeft = this.parentW - this.width;
            }

            this.rawLeft = newLeft;
            this.rawTop = newTop;
            
        },
        // 弹起区域
        itemUp(){

            this.limits = {
                minLeft: null,
                maxLeft: null,
                minTop: null,
                maxTop: null,
            };
            this.stickStartPos = { mouseX: 0, mouseY: 0, left: 0, top: 0 , width: 0, height: 0, maxWidth:0, maxHeight: 0};

        },
        // 范围
        setLimits(){

            const width = this.width;
            const height = this.height;
            const left = this.left;
            const top = this.top;
            const minWidth = this.minWidth;
            const minHeight = this.minHeight;

            let limits = {
                minLeft: 0,
                maxLeft: (left + (width - minWidth)),
                minTop: 0,
                maxTop: (top + (height - minHeight))
            };
            
            return limits;

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
            this.stickStartPos.maxWidth = this.left + this.width;
            this.stickStartPos.maxHeight = this.top + this.height;

            this.limits = this.setLimits();
            
        },
        handleMove(e){

            const stickStartPos = this.stickStartPos;
            let width = stickStartPos.width;
            let height = stickStartPos.height;
            let newTop = stickStartPos.top + (e.pageY - stickStartPos.mouseY);
            let newLeft = stickStartPos.left + (e.pageX - stickStartPos.mouseX);
            
            switch(this.handleName){
                case 'n':
                    this.rawHeight = height - (e.pageY - stickStartPos.mouseY);
                    this.rawTop = newTop;
                    break;
                case 's':
                    this.rawHeight = height + (e.pageY - stickStartPos.mouseY);
                    break;
                case 'e':
                    this.rawWidth = width + (e.pageX - stickStartPos.mouseX);
                    break;
                case 'w':
                    this.rawWidth = width - (e.pageX - stickStartPos.mouseX);
                    this.rawLeft = newLeft;
                    break;
                case 'nw':
                    this.rawHeight = height - (e.pageY - stickStartPos.mouseY);
                    this.rawWidth = width - (e.pageX - stickStartPos.mouseX);
                    this.rawTop = newTop;
                    this.rawLeft = newLeft;
                    break;
                case 'sw':
                    this.rawHeight = height + (e.pageY - stickStartPos.mouseY);
                    this.rawWidth = width - (e.pageX - stickStartPos.mouseX);
                    this.rawLeft = newLeft;
                    break;
                case 'ne':
                    this.rawHeight = height - (e.pageY - stickStartPos.mouseY);
                    this.rawWidth = width + (e.pageX - stickStartPos.mouseX);
                    this.rawTop = newTop;
                    break;
                case 'se':
                    this.rawHeight = height + (e.pageY - stickStartPos.mouseY);
                    this.rawWidth = width + (e.pageX - stickStartPos.mouseX);
                    break;
            }
            
        },
        handleUp(){
            
            this.limits = {
                minLeft: null,
                maxLeft: null,
                minTop: null,
                maxTop: null,
            };
            this.stickStartPos = { mouseX: 0, mouseY: 0, left: 0, top: 0 , width: 0, height: 0, maxWidth:0, maxHeight: 0};

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
        
        &.active{

            .drag-select{
                display: block;
            }

        }
        &.unActive{

            .drag-select{
                display: none;
            }

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