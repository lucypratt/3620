<script>
    /**
	 * @type {string | undefined}
	 */
     export let categoryName;
  
    function removeCategory() {
      const confirmation = confirm(`Are you sure you want to remove the category "${categoryName}"?`);
      if (confirmation) {
        // Implement category removal logic
        // For now, let's assume you have a function to handle category removal
        // You can replace the following line with your actual removal logic
        console.log(`Category "${categoryName}" removed`);
      }
    }
  
    function editCategory() {
      const newName = prompt('Enter new category name:', categoryName);
      if (newName !== null) {
        // Implement category editing logic
        // For now, let's assume you have a function to handle category editing
        // You can replace the following line with your actual editing logic
        console.log(`Category "${categoryName}" renamed to "${newName}"`);
      }
    }
  </script>
  
  <section>
    <h2>{categoryName}</h2>
  
    <button on:click="{editCategory}">Edit</button>
    <button on:click="{removeCategory}">Remove</button>
  </section>
  
  <style>
    /* Tailwind CSS classes can be used directly here */
  </style>
  