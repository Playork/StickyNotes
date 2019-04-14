<script>
const ipc = window.ipc;
const hash = window.location.hash;
const params = {};

hash
  .substr(1)
  .split("&")
  .map(function(pair) {
    const val = pair.split("=");
    params[val[0]] = val[1];
  });

ipc.send("token", params);
</script>
