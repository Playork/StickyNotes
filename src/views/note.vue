<template>
  <div id="note" v-on:click="showhide">
    <titlebar v-bind:close="close" v-bind:note="note"/>
    <editor/>
    <colors/>
    <choosecolor/>
  </div>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import swal from "sweetalert";
import stores from "store";
import editor from "../components/note/editor.vue";
import titlebar from "../components/note/titlebar.vue";
import colors from "../components/note/colors.vue";
import choosecolor from "../components/note/choosecolor.vue";
export default {
  components: {
    titlebar,
    editor,
    colors,
    choosecolor
  },
  mounted() {
    try {
      let text = stores.get(stores.get("id").ids);
      document.querySelector(".ql-snow .ql-editor").innerHTML = text.first;
      document.getElementById("lightYellow").style.backgroundColor = text.back;
      document.getElementById("titlebar").style.backgroundColor = text.title;
    } catch {}
    if (
      document.querySelector(".ql-snow .ql-editor").innerHTML != "<p><br></p>"
    ) {
      let id = Number(stores.get("id").ids) + 10;
      stores.set("id", { ids: id.toString() });
    }
  },
  methods: {
    close: function() {
      swal({
        title: "Are you sure?",
        text: "Want To Delete Your Note!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          stores.each((value, key) => {
            if (key != "id" && key != "loglevel:webpack-dev-server") {
              if (
                value.first ==
                document.querySelector(".ql-snow .ql-editor").innerHTML
              ) {
                stores.remove(key);
              }
            }
          });
          remote.getCurrentWindow().close();
        }
      });
    },
    note: function() {
      let func = obj => {
        obj++;
        stores.set("id", { ids: obj.toString() });
      };
      try {
        let id = Number(stores.get("id").ids);
        func(id);
      } catch {
        let id = 1;
        func(id);
      }
      ipcRenderer.send("create-new-instance");
    },
    showhide: function() {
      document.addEventListener(
        "focus",
        () => {
          document.getElementById("titlebar").style.height = "32px";
          if (
            document.querySelector(".ql-snow.ql-toolbar").style.display !=
            "block"
          ) {
            document.getElementById("color").style.height = "40px";
          }
          document.getElementById("lock").style.display = "flex";
          document.getElementById("lock").style.display = "flex";
          document.getElementById("add").style.display = "flex";
          document.getElementById("more").style.display = "flex";
          document.getElementById("close").style.display = "flex";
        },
        true
      );
      document.addEventListener(
        "click",
        () => {
          document.getElementById("titlebar").style.height = "32px";
          if (
            document.querySelector(".ql-snow.ql-toolbar").style.display !=
            "block"
          ) {
            document.getElementById("color").style.height = "40px";
          }
          document.getElementById("lock").style.display = "flex";
          document.getElementById("lock").style.display = "flex";
          document.getElementById("add").style.display = "flex";
          document.getElementById("more").style.display = "flex";
          document.getElementById("close").style.display = "flex";
        },
        true
      );
      document.addEventListener(
        "blur",
        () => {
          document.getElementById("titlebar").style.height = "0";
          document.getElementById("color").style.height = "0";
          document.getElementById("lock").style.display = "none";
          document.getElementById("add").style.display = "none";
          document.getElementById("more").style.display = "none";
          document.getElementById("close").style.display = "none";
        },
        true
      );
    }
  }
};
</script>
