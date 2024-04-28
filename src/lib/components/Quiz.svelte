<script lang="ts">
    import { onMount, createEventDispatcher  } from 'svelte';
    
    export let currentSet: {
      id: number,
      title: string,
      description: string,
      category: string,
      terms: { id: number, name: string, definition: string }[]
    };
  
    let currentTermIndex = 0
    let selectedAnswer: string = ''
    let correctAnswer: string = ''
    let answerChoices: string[] = []
    let showNextButton = false
    let showResult = false
    let correctCount = 0
  
    const dispatch = createEventDispatcher()

    function initializeQuiz() {
      currentTermIndex = 0
      correctCount = 0
      showResult = false
      showNextButton = false
      getNextQuestion()
    }
  
    
    function getNextQuestion() {
      selectedAnswer = ''
      correctAnswer = currentSet.terms[currentTermIndex].definition
      answerChoices = getAnswerChoices()
      showNextButton = false
    }
  
    
    function getAnswerChoices() {
      const termDefinitions = currentSet.terms.map(term => term.definition)
      const shuffledDefinitions = termDefinitions.filter(definition => definition !== correctAnswer).sort(() => Math.random() - 0.5)
      const answerChoices = shuffledDefinitions.slice(0, 2)
      answerChoices.push(correctAnswer)
      return answerChoices.sort(() => Math.random() - 0.5)
    }
  
    function selectAnswer(answer: string) {
      selectedAnswer = answer
      showNextButton = true
    }
  
    function checkAnswer() {
      if (selectedAnswer === correctAnswer) {
        correctCount++
      }
      currentTermIndex++
      if (currentTermIndex < currentSet.terms.length) {
        getNextQuestion()
      } else {
        showResult = true
      }
    }

    let scoreMessage: any = ''
    function getScores() {
        dispatch('saveScore', { score: correctCount, message: scoreMessage })
        restartQuiz()
    }
  
  
    function restartQuiz() {
      initializeQuiz()
    }
  
    onMount(() => {
      initializeQuiz()
    })

  
  </script>
  
  <main class="m-4">
    <h2 class="text-xl font-bold">Quiz: {currentSet.title}</h2>

    
   

  
    {#if !showResult}
      <div>
        <p class="text-lg font-bold">Question {currentTermIndex + 1} of {currentSet.terms.length}</p>
        <p class="my-2">{currentSet.terms[currentTermIndex].name}</p>
  
        <div class="mt-4">
          {#each answerChoices as answer}
            <button
              class="btn variant-outline-primary mr-2"
              on:click={() => selectAnswer(answer)}
              disabled={showNextButton}
            >
              {answer}
            </button>
          {/each}
        </div>
  
        {#if showNextButton}
          <button class="btn variant-filled-primary mt-4" on:click={checkAnswer}>Next</button>
        {/if}
      </div>
    {:else}
      <div>
        <p class="text-lg font-bold">Quiz Result:</p>
        <p>You got {correctCount} out of {currentSet.terms.length} correct.</p>
        <div>
          <input type="text" placeholder="Enter term" class="p-2 rounded-md" bind:value={scoreMessage}>
            <button class="btn variant-filled-primary mt-4" on:click={getScores}>Save and Restart</button>
            <button class="btn variant-filled-primary mt-4" on:click={restartQuiz}> Discard and Restart</button>
            
        </div>
        
      </div>
    {/if}

    
  </main>
  