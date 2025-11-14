/**
 * Live API Integration Test for Autobound Module
 *
 * Tests the Autobound module with actual API calls to verify:
 * 1. generateContent endpoint works correctly
 * 2. generateInsights endpoint works correctly
 * 3. Error handling for invalid inputs
 */

import { generateContent, generateInsights } from './src/modules/ai/autobound';

const API_KEY = '005e79b5a1662c9daa59a5632680e50cf28ca96c790c6f5cca8a58681d4a';

async function testGenerateContent() {
  console.log('\n🧪 Testing generateContent endpoint...\n');

  try {
    // Using LinkedIn URLs instead of emails since Autobound requires contacts from their database
    const result = await generateContent({
      apiKey: API_KEY,
      contactLinkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
      userLinkedinUrl: 'https://www.linkedin.com/in/williamhgates/',
      contentType: 'email',
      valueProposition: 'We help companies automate their sales outreach with AI',
      wordCount: 100,
    });

    console.log('✅ Generate Content Success!');
    console.log('----------------------------');
    console.log('Number of content items:', result.contentList?.length);
    console.log('Model used:', result.contentList[0]?.modelUsed);
    console.log('\nSubject:', result.contentList[0]?.subject);
    console.log('\nContent preview:', result.contentList[0]?.content?.substring(0, 200) + '...');
    console.log('\nInsights used:', result.contentList[0]?.insightsUsed?.length || 0);

    if (result.contactEmail) {
      console.log('\nResolved contact:', result.contactEmail);
      console.log('Contact company:', result.contactCompanyName);
      console.log('Contact title:', result.contactJobTitle);
    }

    return true;
  } catch (error) {
    console.error('❌ Generate Content Failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function testGenerateInsights() {
  console.log('\n🧪 Testing generateInsights endpoint...\n');

  try {
    const result = await generateInsights({
      apiKey: API_KEY,
      contactLinkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
    });

    console.log('✅ Generate Insights Success!');
    console.log('----------------------------');
    console.log('Success:', result.success);
    console.log('Number of insights:', result.insights?.length || 0);

    if (result.prospectResolution) {
      console.log('\nProspect Resolution:');
      console.log('  Name:', result.prospectResolution.contactName);
      console.log('  Company:', result.prospectResolution.contactCompanyName);
      console.log('  Title:', result.prospectResolution.contactJobTitle);
    }

    if (result.insights && result.insights.length > 0) {
      console.log('\nTop 5 Insights:');
      result.insights.slice(0, 5).forEach((insight, idx) => {
        console.log(`  ${idx + 1}. [${insight.type}/${insight.subType}] ${insight.name}`);
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Generate Insights Failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function testOpenerGeneration() {
  console.log('\n🧪 Testing opener generation...\n');

  try {
    const result = await generateContent({
      apiKey: API_KEY,
      contactLinkedinUrl: 'https://www.linkedin.com/in/jeffweiner08/',
      userLinkedinUrl: 'https://www.linkedin.com/in/williamhgates/',
      contentType: 'opener',
      wordCount: 50,
    });

    console.log('✅ Generate Opener Success!');
    console.log('----------------------------');
    console.log('Opener:', result.contentList[0]?.content);
    console.log('Model:', result.contentList[0]?.modelUsed);

    return true;
  } catch (error) {
    console.error('❌ Generate Opener Failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function testWithLinkedInUrls() {
  console.log('\n🧪 Testing with LinkedIn URLs...\n');

  try {
    const result = await generateContent({
      apiKey: API_KEY,
      contactLinkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
      userLinkedinUrl: 'https://www.linkedin.com/in/williamhgates/',
      contentType: 'connectionRequest',
    });

    console.log('✅ LinkedIn URL Test Success!');
    console.log('----------------------------');
    console.log('Content:', result.contentList[0]?.content);
    console.log('\nResolved Contact:', result.contactLinkedinUrl);
    console.log('User:', result.userLinkedinUrl);

    return true;
  } catch (error) {
    console.error('❌ LinkedIn URL Test Failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function testFilteredInsights() {
  console.log('\n🧪 Testing filtered insights (podcast subtype)...\n');

  try {
    const result = await generateInsights({
      apiKey: API_KEY,
      contactLinkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
      insightSubtype: 'podcast',
    });

    console.log('✅ Filtered Insights Success!');
    console.log('----------------------------');
    console.log('Number of insights:', result.insights?.length || 0);

    if (result.insights && result.insights.length > 0) {
      result.insights.forEach((insight, idx) => {
        console.log(`  ${idx + 1}. ${insight.name} (${insight.subType})`);
      });
    } else {
      console.log('  No podcast insights found for this contact');
    }

    return true;
  } catch (error) {
    console.error('❌ Filtered Insights Failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

async function testErrorHandling() {
  console.log('\n🧪 Testing error handling...\n');

  try {
    // This should fail with missing required fields
    await generateContent({
      apiKey: API_KEY,
      contentType: 'email',
      // Missing contactEmail/contactLinkedinUrl and userEmail/userLinkedinUrl
    } as any);

    console.log('❌ Should have thrown an error but did not');
    return false;
  } catch (error) {
    console.log('✅ Error Handling Works!');
    console.log('----------------------------');
    console.log('Expected error caught:', error instanceof Error ? error.message : error);
    return true;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Autobound Live API Integration Tests');
  console.log('='.repeat(50));

  const results = {
    generateContent: await testGenerateContent(),
    generateInsights: await testGenerateInsights(),
    opener: await testOpenerGeneration(),
    linkedIn: await testWithLinkedInUrls(),
    filteredInsights: await testFilteredInsights(),
    errorHandling: await testErrorHandling(),
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const passedCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;

  console.log('\n' + '='.repeat(50));
  console.log(`Final Score: ${passedCount}/${totalCount} tests passed`);
  console.log('='.repeat(50) + '\n');

  if (passedCount === totalCount) {
    console.log('🎉 All tests passed! Autobound module is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the output above.\n');
  }

  process.exit(passedCount === totalCount ? 0 : 1);
}

runAllTests();
