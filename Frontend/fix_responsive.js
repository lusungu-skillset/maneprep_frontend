const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components/admin/admin-dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add min-w-0 to all <Card className="...">
content = content.replace(/<Card className="([^"]+)">/g, (match, classStr) => {
    if (!classStr.includes('min-w-0')) {
        classStr += ' min-w-0';
    }
    return `<Card className="${classStr}">`;
});

// 2. Wrap <Table> with div.overflow-x-auto
content = content.replace(/<Table>/g, '<div className="overflow-x-auto w-full min-w-0">\\n              <Table className="min-w-max">');
content = content.replace(/<\/Table>/g, '</Table>\\n              </div>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed responsive layouts');
