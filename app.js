// Facebook SDK Initialization and Login Handling

// Initialize Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId      : 'YOUR_APP_ID', // Replace with your Facebook App ID
    xfbml      : true,
    version    : 'v18.0'
  });

  // Check the login status upon init completion
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Handle changes to the login status
function statusChangeCallback(response) {
  console.log('statusChangeCallback:', response);

  if (response.status === 'connected') {
    // The user is logged in and authenticated
    testAPI();
    onLoginSuccess(response);
  } else if (response.status === 'not_authorized') {
    // The user is logged in to Facebook but not to the app
    console.log('User is logged in to Facebook but not authenticated with the app');
  } else {
    // The user is not logged in to Facebook
    console.log('User is not logged in to Facebook');
  }
}

// Handle Facebook login button click
function handleLoginClick() {
  FB.login(function(response) {
    statusChangeCallback(response);
  }, {scope: 'public_profile,email'});
}

// Handle Facebook logout button click
function handleLogoutClick() {
  FB.logout(function(response) {
    console.log('User logged out:', response);
    onLogoutSuccess();
  });
}

// Called when a person is logged in
function onLoginSuccess(response) {
  console.log('Login successful!', response);
  
  // Get user details
  FB.api('/me', {fields: 'id,name,email,picture'}, function(userInfo) {
    console.log('User Info:', userInfo);
    
    // Display user information
    displayUserInfo(userInfo);
    
    // Hide login button and show logout button
    document.getElementById('fb-login-btn')?.classList.add('hidden');
    document.getElementById('fb-logout-btn')?.classList.remove('hidden');
    document.getElementById('user-profile')?.classList.remove('hidden');
  });
}

// Called when a person is logged out
function onLogoutSuccess() {
  console.log('Logout successful!');
  
  // Clear user information
  document.getElementById('user-profile')?.classList.add('hidden');
  document.getElementById('user-info')?.innerHTML = '';
  
  // Show login button and hide logout button
  document.getElementById('fb-login-btn')?.classList.remove('hidden');
  document.getElementById('fb-logout-btn')?.classList.add('hidden');
}

// Display user information on the page
function displayUserInfo(userInfo) {
  const userInfoElement = document.getElementById('user-info');
  
  if (userInfoElement) {
    const profilePicture = userInfo.picture ? userInfo.picture.data.url : '';
    const userName = userInfo.name || 'User';
    const userEmail = userInfo.email || 'Email not available';
    
    userInfoElement.innerHTML = `
      <div class="user-profile-card">
        <img src="${profilePicture}" alt="Profile Picture" class="profile-picture">
        <div class="user-details">
          <h3>${userName}</h3>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>ID:</strong> ${userInfo.id}</p>
        </div>
      </div>
    `;
  }
}

// Test API call to get user data
function testAPI() {
  console.log('Welcome! Fetching your information....');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
  });
}

// Error handler for API calls
function handleFBError(error) {
  console.error('Facebook SDK Error:', error);
  alert('An error occurred. Please try again.');
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  // Attach event listeners to buttons if they exist
  const loginBtn = document.getElementById('fb-login-btn');
  const logoutBtn = document.getElementById('fb-logout-btn');

  if (loginBtn) {
    loginBtn.addEventListener('click', handleLoginClick);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogoutClick);
  }
});

// Export functions for use in HTML or other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleLoginClick,
    handleLogoutClick,
    statusChangeCallback,
    testAPI,
    displayUserInfo
  };
}
