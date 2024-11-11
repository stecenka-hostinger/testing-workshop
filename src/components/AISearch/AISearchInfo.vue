<script lang="ts" setup></script>

<template>
  <div class="info-bar">
    <div>
      <span
        class="text-body-2 info-bar__ai-search"
        data-qa="ai-search-info-text-top"
      >
        AI Search
      </span>
      <img class="info-bar__beta-icon" alt="" />
      <p
        class="text-body-2 info-bar__text"
        data-qa="ai-search-info-text-bottom"
      >
        Feel free to give a command like "Renew my service" and I'll assist you
        by directing you to the relevant pages or providing the necessary
        information.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-bar {
  $this: &;

  background-color: var(--white-blue);
  display: flex;
  gap: 8px;
  padding: 16px 16px;
  border-radius: 4px;
  text-align: left;

  &__text {
    color: var(--dark);
  }

  &__ai-search {
    color: var(--dark);
  }

  &--dark {
    background-color: #2e2f34;

    #{$this}__text {
      color: var(--light);
    }

    #{$this}__ai-search {
      color: var(--light);
    }
  }

  &__beta-icon {
    margin-left: 4px;
    vertical-align: top;
  }
}
</style>
