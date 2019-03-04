<template>
  <div id="lightYellow">
    <div id="editor" data-meteor-emoji="true"></div>
  </div>
</template>
<script>
import Quill from "quill";
import stores from "store";
import emoji from "./../../assets/meteorEmoji.js";
export default {
  mounted() {
    var BackgroundClass = Quill.import("attributors/class/background");
    var ColorClass = Quill.import("attributors/class/color");
    var SizeStyle = Quill.import("attributors/style/size");
    SizeStyle.whitelist = ["10px", "18px", "27px", "37px"];
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);
    var Font = Quill.import("formats/font");
    Font.whitelist = ["lobster", "comicsans"];
    Quill.register(Font, true);
    let quill = new Quill("#editor", {
      modules: {
        toolbar: [
          [
            { font: ["", "lobster", "comicsans"] },
            { size: ["10px", "18px", "27px", "37px"] },
            "bold",
            "italic",
            "underline",
            "strike",
            {
              color: [
                "black",
                "white",
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple"
              ]
            },
            {
              background: [
                "black",
                "white",
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple"
              ]
            },
            { list: "bullet" },
            { list: "ordered" },
            { align: "" },
            { align: "center" },
            { align: "right" },
            "clean",
            "image",
          ]
        ]
      },
      placeholder: "Add Your Note",
      theme: "snow"
    });
    let func = obj => {
      quill.on("text-change", function() {
        let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
        let color1 = window
          .getComputedStyle(document.getElementById("lightYellow"))
          .getPropertyValue("background-color");
        let color2 = window
          .getComputedStyle(document.getElementById("titlebar"))
          .getPropertyValue("background-color");
        stores.set(obj.toString(), {
          first: text,
          back: color1,
          title: color2
        });
      });
      document.getElementById("color").addEventListener("click", () => {
        let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
        if (text != "<p><br></p>") {
          let color1 = window
            .getComputedStyle(document.getElementById("lightYellow"))
            .getPropertyValue("background-color");
          let color2 = window
            .getComputedStyle(document.getElementById("titlebar"))
            .getPropertyValue("background-color");
          stores.set(obj.toString(), {
            first: text,
            back: color1,
            title: color2
          });
        }
      });
    };
    try {
      let id = Number(stores.get("id").ids);
      func(id);
    } catch {
      let id = 1;
      func(id);
    }
    new emoji();
  }
};
</script>
