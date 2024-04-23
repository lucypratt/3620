<script>
    /**
	 * @type {string | any[]}
	 */
     export let terms;
  
    let currentQuestion = 0;
    let score = 0;
  
    /**
     * @param {number} answerIndex
     */
    function answerQuestion(answerIndex) {
      if (terms[currentQuestion].correctIndex === answerIndex) {
        score++; // Increase score if the answer is correct
      }
    }
  
    function nextQuestion() {
      if (currentQuestion < terms.length - 1) {
        currentQuestion++; // Move to the next question if available
      }
    }
  </script>
  
  <section>
    <h3>Quiz</h3>
  
    {#if currentQuestion < terms.length}
      <div>
        <div>{terms[currentQuestion].name}</div>
        <ul>
          {#each terms[currentQuestion].options as option, index}
            <li on:click="{() => answerQuestion(index)}">{option}</li>
          {/each}
        </ul>
      </div>
      <button on:click="{nextQuestion}">Next</button>
    {:else}
      <div>
        <h4>Quiz completed!</h4>
        <p>Your score: {score}/{terms.length}</p>
      </div>
    {/if}
  </section>
  