$(document).ready(() => {
  $('.deletetodo').on('click', (e) => {
    const id = $(e.target).attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/todo/delete/' + id,
      success: (response) => {
        alert('Deleting Todo');
        window.location.href = '/';
      },

      error: (error) => {
        console.log(error);
      }

    })
  });
});

