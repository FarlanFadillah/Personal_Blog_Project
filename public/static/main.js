function deleteArticle(id){
    const answer = confirm('Are you sure you want to delete this article?');
    if(answer){
        document.querySelector('#delete_form_'+id).submit();
    }
}

function deleteUser(username){
    const answer = confirm('Are you sure you want to delete this user?');
    if(answer){
        document.querySelector('#delete_form_'+username).submit();
    }
}

