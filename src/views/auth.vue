<script>
import store from "store";
import utils from "dropbox/lib/utils";
import { setTimeout } from "timers";
import { remote } from "electron";
export default {
  mounted() {
    try {
      let url = utils.parseQueryString(window.location.hash).access_token;
      store.set("access", {
        access: url
      });
    } catch (e) {
      alert(e);
    }
    window.setTimeout(() => {
      remote.getCurrentWindow().destroy();
    }, 100);
  }
};
</script>
