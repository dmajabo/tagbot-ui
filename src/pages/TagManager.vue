<template>
  <div class="content connections-content">
    <div class="flex-title"><h1 class="title-dashboard">Tag manager</h1></div>
    <div><p class="text-content-connection">Please, define keys values</p>
      <form class="form-tag-manager">
        <div><input type="search" class="token-input-connection" placeholder="Enter key">
          <button class="clear-text">x</button>
          <button><img src="/img/delete.svg" alt="del">
          </button>
        </div>
        <button class="new-tag-button"><img
            src="/img/plus.svg" alt=""> New Tag
        </button>
        <button class="add-tag-button">Add tag</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>