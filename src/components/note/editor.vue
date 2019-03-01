<template>
  <div id="lightYellow">
    <div id="editor"></div>
  </div>
</template>
<script>
import Quill from "quill";
import stores from "store";
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
            "video"
          ]
        ]
      },
      placeholder: "Add Your Note",
      theme: "snow"
    });
    let func = obj => {
      let text = quill.root.innerHTML;
      stores.set(obj.toString(), { first: text });
    };
    try {
      let id = Number(stores.get("id").ids);
      quill.on("text-change", function() {
        func(id);
      });
    } catch {
      let id = 1;
      quill.on("text-change", function() {
        func(id);
      });
    }
  }
};
</script>
