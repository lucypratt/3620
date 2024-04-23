<script>
    /**
     * @type {{ terms: any[]; newTerm: string; newDefinition: string; }}
     */
    export let category;
  
    function addTerm() {
      if (category.newTerm && category.newDefinition) {
        category.terms.push({
          id: Date.now(), // Generate unique ID for the term
          name: category.newTerm,
          definition: category.newDefinition
        });
        // Clear input fields after adding the term
        category.newTerm = '';
        category.newDefinition = '';
      }
    }
  
    /**
     * @param {any} termId
     */
    function removeTerm(termId) {
      const index = category.terms.findIndex(term => term.id === termId);
      if (index !== -1) {
        category.terms.splice(index, 1); // Remove the term from the list
      }
    }
  
    /**
     * @param {any} termId
     */
    function editTerm(termId) {
      const index = category.terms.findIndex(term => term.id === termId);
      if (index !== -1) {
        const newName = prompt('Enter new term name:', category.terms[index].name);
        const newDefinition = prompt('Enter new term definition:', category.terms[index].definition);
        if (newName !== null && newDefinition !== null) {
          // Update term details if user provided valid input
          category.terms[index].name = newName;
          category.terms[index].definition = newDefinition;
        }
      }
    }
  </script>
  
  <section>
    <h3>Terms</h3>
  
    <ul>
      {#each category.terms as term}
        <li>
          <div>{term.name}</div>
          <div>{term.definition}</div>
          <button on:click="{() => editTerm(term.id)}">Edit</button>
          <button on:click="{() => removeTerm(term.id)}">Remove</button>
        </li>
      {/each}
    </ul>
  
    <form on:submit|preventDefault="{() => addTerm()}">
      <input type="text" placeholder="Enter term" bind:value="{category.newTerm}" />
      <input type="text" placeholder="Enter definition" bind:value="{category.newDefinition}" />
      <button type="submit">Add Term</button>
    </form>
  </section>
  