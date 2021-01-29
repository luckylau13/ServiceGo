function deleteProfile(email) {
    $.ajax({
        url: '/user/profiles',
        type: 'DELETE',
        data: {
            email: email
        },
        success: function(result) {
            if(result === 'success') {
                window.location.href='/user/profiles';
            }
        }
    });
}