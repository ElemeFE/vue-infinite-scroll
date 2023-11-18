<template>
  <div v-infinite-scroll>
</template>

<script setup>
import {useQuery} from '@vue/apollo-composable'
import {graphql} from '@/gql'
import {computed, ref} from 'vue'
import {useScrollEnd} from '@/composables/use-scroll-end'
import {useCommonStoreRefs} from '@/stores/common.store'

const {verbs} = useCommonStoreRefs()

const defaultPageSize = 8;

const PageSize = computed(() => {
  return props.pageSize ? props.pageSize : defaultPageSize;
})

let {result, loading, fetchMore} = useQuery({});

const isLoadingMore = ref(false);

function loadMore() {
  if (result.value?.nftTokens?.pageInfo.hasNextPage) {
    isLoadingMore.value = true;
    try {
      fetchMore({
        variables: {
          cursor: result.value?.nftTokens?.pageInfo.endCursor,
          // after: result.value?.nftTokens?.pageInfo.hasNextPage
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          setTimeout(onScrollEnd, 100);
          isLoadingMore.value = false;
          return {
            nftTokens: {
              __typename: fetchMoreResult?.nftTokens?.__typename,
              nodes: [
                ...Array.from(previousResult?.nftTokens?.nodes ?? []),
                ...Array.from(fetchMoreResult?.nftTokens?.nodes ?? [])
              ],
              pageInfo: fetchMoreResult?.nftTokens?.pageInfo,
              totalCount:
                fetchMoreResult?.nftTokens?.totalCount ?? previousResult?.nftTokens?.totalCount ?? 0
            },
          };
        }
      });
    } catch (error) {
      // Обработка ошибки
      console.error('Произошла ошибка:', error);
    }
  }
}

let onScrollEnd;
if (!props.disableScrollEnd) {
  onScrollEnd = useScrollEnd(loadMore);
}
</script>

<style lang="scss">
.ListingsList {
  width: 100%;
  //height: auto;
  height: fit-content;
  display: flex;
  flex-flow: row wrap;
  //align-items: center;
  gap: 16px;

  .card-item {
    display: block;
    height: auto;
  }

}
</style>
