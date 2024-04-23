<script>
    /**
	 * @type {any[]}
	 */
     export let terms;
  
    /**
	 * @type {any[]}
	 */
    let flippedCards = [];
  
    /**
     * @param {any} termId
     */
    function flipCard(termId) {
      const index = terms.findIndex((/** @type {{ id: any; }} */ term) => term.id === termId);
      if (index !== -1 && !terms[index].flipped && flippedCards.length < 2) {
        terms[index].flipped = true;
        flippedCards.push(terms[index]);
      }
    }
  
    function checkMatch() {
      if (flippedCards.length === 2) {
        if (flippedCards[0].id === flippedCards[1].id) {
          // Match found
          // You can implement additional logic here like removing matched cards or updating score
        } else {
          // No match, flip cards back
          flippedCards.forEach(card => {
            const index = terms.findIndex((/** @type {{ id: any; }} */ term) => term.id === card.id);
            if (index !== -1) {
              terms[index].flipped = false;
            }
          });
        }
        flippedCards = []; // Reset flipped cards array
      }
    }
  </script>
  
  <section>
    <h3>Memory Game</h3>
  
    <div class="grid grid-cols-3 gap-4">
      {#each terms as term}
        <div class="card" on:click="{() => flipCard(term.id)}">
          {#if term.flipped}
            <div>{term.name}</div>
            <div>{term.definition}</div>
          {:else}
            <div>?</div>
          {/if}
        </div>
      {/each}
    </div>
  
    <button on:click="{checkMatch}">Check Match</button>
  </section>
  