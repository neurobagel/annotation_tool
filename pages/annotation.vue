<template>

    <b-container>

        <b-row>
            <h1>Column Annotation</h1>
        </b-row>

        <b-row>
            <b-col cols="4"></b-col>
            <b-col cols="4">
                <img class="vertical-center-mockup"
                     :src="require(`~/assets/${mockupImage.filename}`)"
                     :width="mockupImage.width"
                     :height="mockupImage.height"/>
            </b-col>
            <b-col cols="4"></b-col>                
        </b-row>

    </b-container>

</template>

<script>

    export default {

        data() {

            return {

                mockupImage: {

                    filename: "myimage.jpeg",
                    height: 300,
                    width: 300
                }
            }
        }
    }

</script>

<style>

.vertical-center-mockup {

    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(50%);
    transform: translateY(50%);
}

</style>