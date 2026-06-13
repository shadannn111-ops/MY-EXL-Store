const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, 'data', 'users.json');

console.log('\n========================================');
console.log('📊 EXL STORE - USER DATABASE');
console.log('========================================\n');

// Check if data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    console.log('📁 Creating data folder...');
    fs.mkdirSync(path.join(__dirname, 'data'));
    console.log('✅ Data folder created!\n');
}

// Check if users.json exists
if (!fs.existsSync(usersFile)) {
    console.log('📝 Creating users.json file...');
    fs.writeFileSync(usersFile, '[]');
    console.log('✅ users.json created!\n');
    console.log('👉 No users yet. Please sign up first!');
    console.log('📍 Signup page: http://localhost:3000/signup.html\n');
    process.exit(0);
}

// Read and display users
const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

if (users.length === 0) {
    console.log('❌ No users found!');
    console.log('👉 Please sign up at: http://localhost:3000/signup.html\n');
} else {
    console.log(`✅ TOTAL USERS: ${users.length}\n`);
    console.log('┌─────┬──────────────────────┬────────────────────────────┬──────────────┐');
    console.log('│ No. │ Name                 │ Email                      │ Mobile       │');
    console.log('├─────┼──────────────────────┼────────────────────────────┼──────────────┤');
    
    users.forEach((user, i) => {
        const name = (user.name + '                    ').slice(0, 20);
        const email = (user.email + '                        ').slice(0, 26);
        const mobile = user.mobile || 'Not provided';
        const mobileStr = (mobile + '            ').slice(0, 12);
        console.log(`│ ${(i+1).toString().padStart(3)} │ ${name} │ ${email} │ ${mobileStr} │`);
    });
    
    console.log('└─────┴──────────────────────┴────────────────────────────┴──────────────┘');
    console.log('\n📁 File: ' + usersFile);
    console.log('========================================\n');
}