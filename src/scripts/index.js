import * as d3 from "d3";
import {generatePoints} from "./utils";

class Sierpinski {

    constructor({depth, element, viewWidth, viewHeight, triangleHeight}) {

        this.parent;
        this.child;
        this.depth = depth;
        this.element = element;
        this.scale = d3
            .scaleLinear()
            .domain([1, 50])
            .range([this.depth, 10]);
        this.zoom = d3
            .zoom()
            .scaleExtent([1, 50])
            .on("zoom", this.zoom)
        this.stage = {
            scale: 1,
            width: viewWidth,
            height: viewHeight,
            x: viewWidth * 0.5,
            y: viewHeight * 0.5
            // y: viewHeight * 0.5
        }

        this.triangle = {
            height: triangleHeight,
            initialX: this.stage.width * 0.5,
            initialY: 10,
            colour: "#000"
        }

        this.draw();

    }

    getPoints = () => {
        return generatePoints([
            0, 0
        ], [
            this.triangle.height / 2,
            this.triangle.height
        ], [-this.triangle.height / 2,
            this.triangle.height
        ], this.depth)
    }

    drawSierpinski = () => {
        this
            .child
            .selectAll("g")
            .data(this.getPoints)
            .enter()
            .append("polygon")
            .attr("fill", this.triangle.colour)
            .attr("points", function (d) {
                return d
            });
    }

    draw = () => {

        let svg = d3
            .select(this.element)
            .append("svg:svg")
            .attr("id", "sierpinski-triangle-explorer")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + this.stage.width + ' ' + this.stage.height)
            .attr("width", "100%")
            .attr("height", "100%")
            // .on("click", this.reDraw)
            .call(this.zoom)

        this.parent = svg.append("g");
        this.child = this
            .parent
            .append("g")
            .attr("id", "sierpinski-triangle-container")
            .attr("transform", "translate(" + this.triangle.initialX + "," + this.triangle.initialY + ")")
        this.drawSierpinski();
    }

    reDraw = () => {
        // this.depth += 1; if (this.depth >= 10)         return;

        this
            .parent
            .selectAll("g")
            .selectAll("*")
            .remove()

        this.drawSierpinski();
    }

    zoom = () => {
        const {k, x, y} = d3.event.transform;
        // console.log(Math.ceil(k));
        let scale = Math.ceil(this.scale(Math.ceil(k)));
        if (this.stage.scale != scale) {
            // console.log(scale)
            // this.stage.scale < scale
            //     ? this.depth += 1
            //     : this.depth -= 1;

            this.stage.scale = this.depth = scale;
            // console.log(this.depth)
            //     this.stage.scale = scale;
            
            // if (this.depth > 5) 
            //     this.depth = 5;

            // if (this.depth < 1) 
            //     this.depth = 5;

            // console.log(this.depth)
            this.reDraw();

            console.log(Math.ceil(this.scale(Math.ceil(k))));
        }
        this
            .parent
            .attr("transform", d3.event.transform);

    }

    drag = function (d) {
        d3
            .select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y);
    }

};

new Sierpinski({depth: 4, element: ".page-content", viewWidth: 480, viewHeight: 250, triangleHeight: 100});