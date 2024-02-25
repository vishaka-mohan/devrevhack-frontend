/* eslint-disable eqeqeq */
import logo from './logo.svg';
import './App.css';
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import React, { useState, useEffect } from 'react'
import OpenAI from "openai"


function App() {


  const [reviewData, setReviewData] = useState([]);
  const [positiveSummary, setPositiveSummary] = useState('')
  const [issueSummary, setIssueSummary] = useState('')
  const [featureSummary, setFeatureSummary] = useState('')
  const [competitorDoneWell, setCompetitorDoneWell] = useState('')
  const [companyStepIn, setCompanyStepIn] = useState('')
  const openai = new OpenAI({apiKey: process.env.REACT_APP_API_KEY, dangerouslyAllowBrowser: true})

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('https://devrevhacklimbo.onrender.com/data');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data)
            setReviewData(data.data);
        } catch (error) {
            console.error('Error fetching review data:', error);
        }
    };


    const fetchPositiveData = async () => {
      try {
          const response = await fetch('https://devrevhacklimbo.onrender.com/insights?query=what are our strength areas');
          if (!response.ok) {
              throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          console.log(data)
          const formattedText = data.response.replace(/\n/g, "<br><br>")
          setPositiveSummary(formattedText);
          console.log(data.response)
      } catch (error) {
          console.error('Error fetching review data:', error);
      }
  };

  const fetchIssueData = async () => {
    try {
        const response = await fetch('https://devrevhacklimbo.onrender.com/insights?query=what are the most common issues/complaints');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const formattedText = data.response.replace(/\n/g, "<br><br>")
        setIssueSummary(formattedText);
        console.log(data.response)
    } catch (error) {
        console.error('Error fetching review data:', error);
    }
};

const fetchFeatureData = async () => {
  try {
      const response = await fetch('https://devrevhacklimbo.onrender.com/insights?query=what are the most popular features requested');
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data)
      const formattedText = data.response.replace(/\n/g, "<br><br>")
      setFeatureSummary(formattedText);
      console.log(data.response)
  } catch (error) {
      console.error('Error fetching review data:', error);
  }
};



  const fetchComparisonCompetitorsAdv = async (question) => {

      let messages = [{ role: "system", content: "You will be given a question and two sets of reviews. The first set would be the reviews of my company and the second set is the reviews of the competitor's company. You need to examine both the company's reviews and come up with a relevant answer to the question. The answer should be short and crisp - preferably as bullet points. Make sure you stick to the question and analyze the data well to come up with the answer. Just give the answer as the response. Example: Question: What is something that both the companies have in common? My Company Review Set: good delivery service, worst food quality, my payment gateway crashed. Competitor Review Set: excellent food quality! loved it!, the delivery service is awesome, the UI is too cluttered. Your response might be: - Both the companies have a good delivery service experience." }]


      let content = "Question: " + question + ' My Company Review Set: '
      companyReviews.forEach(review => {
        content += review + ' '; // Add each review followed by a newline character
      })
      content += ' Competitor Review Set: '
      competitorReviews.forEach(review => {
        content += review + ' '; // Add each review followed by a newline character
      })


      messages.push({role: "user", content: content})
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
      });
      console.log('hello')
      console.log(completion.choices[0].message.content)
      const res = completion.choices[0].message.content
      const formattedText = res.replace(/\n/g, "<br><br>")
      if(question == 'What are some areas where the competitor is doing well?'){
        setCompetitorDoneWell(formattedText)
      }
      else{
        setCompanyStepIn(formattedText)
      }
  }

    fetchData()
    fetchPositiveData()
    fetchIssueData()
    fetchFeatureData()
    fetchComparisonCompetitorsAdv('What are some areas where the competitor is doing well?')
    fetchComparisonCompetitorsAdv('What are some areas where my company can step in and the competitor is lacking?')
}, [])
  
  const countSentiments = (reviews) => {
    let counts = [
      { id: 0, value: 0, label: 'Positive' },
      { id: 1, value: 0, label: 'Negative' },
      { id: 2, value: 0, label: 'Neutral' },
  ];

  reviews.forEach(review => {
      switch (review.sentiment) {
          case 'Positive':
              counts[0].value++;
              break;
          case 'Negative':
              counts[1].value++;
              break;
          case 'Neutral':
              counts[2].value++;
              break;
          default:
              break;
      }
  });

  return counts;
  }

  const countFeatureReviews = (reviewData) => {
    let featureReviewCount = 0;

    reviewData.forEach(review => {
        if (review.review_type === "Feature") {
            featureReviewCount++;
        }
    });

    return featureReviewCount;
}



const companyReviews = [
  "I absolutely love shopping with our company! The user interface is so intuitive and easy to navigate.",
  "The delivery was incredibly fast, and the quality of the products exceeded my expectations.",
  "I had an issue with my payment processing, but customer service was quick to resolve it. Very impressed with their support!",
  "The variety of products available is outstanding. I can always find what I need.",
  "Unfortunately, there was a delay in my delivery. It arrived a day later than expected.",
  "The checkout process is smooth and hassle-free. Never had any problems with payments.",
  "The packaging was done neatly, ensuring that the products arrived in perfect condition.",
  "I'm satisfied with the overall quality of the items I purchased. Good value for money.",
  "There are occasional glitches in the mobile app, but they're usually fixed quickly with updates.",
  "I wish there were more options for same-day delivery. Sometimes I need items urgently."
];

const competitorReviews = [
  "The website is slow to load, and it's frustrating to browse through products.",
  "Quality control seems to be lacking. Some of the items I received were damaged.",
  "I've had multiple issues with payments getting declined for no apparent reason.",
  "The delivery took much longer than promised, causing inconvenience.",
  "Their customer service is unresponsive. It's hard to get assistance when needed.",
  "I love the loyalty program they offer. It's a great incentive to keep coming back.",
  "The prices are competitive, but the shipping fees are quite high.",
  "The mobile app crashes frequently, making it difficult to complete purchases.",
  "The product descriptions on their website are inaccurate at times.",
  "I had a pleasant experience shopping with them. The products were of good quality and arrived on time."
]




const countIssueReviews = (reviewData) => {
  let featureIssueCount = 0;

  reviewData.forEach(review => {
      if (review.review_type === "Issue") {
          featureIssueCount++;
      }
  });

  return featureIssueCount;
}


const countPositiveReviews = (reviewData) => {
  let featurePositiveCount = 0;

  reviewData.forEach(review => {
      if (review.sentiment === "Positive") {
          featurePositiveCount++;
      }
  });

  return featurePositiveCount;
}


const countReviewTypes = (reviewData) => {
  let featureCount = 0;
  let issueCount = 0;
  let noneCount = 0;

  reviewData.forEach(review => {
      switch (review.review_type) {
          case "Feature":
              featureCount++;
              break;
          case "Issue":
              issueCount++;
              break;
          default:
              noneCount++;
              break;
      }
  });

  return [featureCount, issueCount, noneCount];
}



const getClusterFrequencies = (reviewData) =>  {
  const clusterFrequencyMap = {};

  // Count the frequency of each cluster
  reviewData.forEach(review => {
    if (review.cluster !== "Miscellaneous") {
      if (clusterFrequencyMap.hasOwnProperty(review.cluster)) {
        clusterFrequencyMap[review.cluster]++;
    } else {
        clusterFrequencyMap[review.cluster] = 1;
    }
    }
      
  });

  // Extract unique cluster names and their frequencies
  const clusters = Object.keys(clusterFrequencyMap);
  const frequencies = Object.values(clusterFrequencyMap);

  return [clusters, frequencies];
}


  return (
    <div className="App min-h-screen bg-gradient-to-b from-sky-200 to-sky-600 opacity-95 overflow-x-hidden text-zinc-800 px-5">
       <div class="container mx-auto px-5 py-3 flex justify-between items-center">
        <span class="text-xl font-semibold">DevRev Insights</span>
      </div>
      
     {reviewData && reviewData.length > 0 && positiveSummary != '' && issueSummary != '' && featureSummary != '' && companyStepIn != '' && competitorDoneWell != '' ? (
      <div class="container m-2">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md"><h2 class="text-lg font-semibold mb-4">Positive Reviews</h2>
          <p class="text-3xl font-bold">{countPositiveReviews(reviewData)}</p>
    
        
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md">
        <h2 class="text-lg font-semibold mb-4">Issues Reported</h2>
          <p class="text-3xl font-bold">{countIssueReviews(reviewData)}</p>
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md">
        <h2 class="text-lg font-semibold mb-4">Feature Requests</h2>
          <p class="text-3xl font-bold">{countFeatureReviews(reviewData)}</p>
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md">
        <PieChart
          series={[
            {
              data: countSentiments(reviewData),
            },
          ]}
          width={400}
          height={200}
        />
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md">
        <BarChart
            width={500}
            height={300}
            series={[
              { data: getClusterFrequencies(reviewData)[1], label: 'issue type', id: 'type' }
     
            ]}
            xAxis={[{ data: getClusterFrequencies(reviewData)[0], scaleType: 'band' }]}
          />
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md">
        <BarChart
            width={500}
            height={300}
            series={[
              { data: countReviewTypes(reviewData), label: 'review type', id: 'review_id' }
            ]}
            xAxis={[{ data: ['feature', 'issue', 'none'], scaleType: 'band' }]}
          />
        </div>
        
        
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md text-justify">
            <h3 className='font-bold'>What went right for us:</h3>
            <span dangerouslySetInnerHTML={{ __html: positiveSummary }}></span>
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md text-justify">
          <h3 className='font-bold'>What the key issue themes are:</h3>
            <span dangerouslySetInnerHTML={{ __html: issueSummary }}></span>
        </div>
        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md text-justify">
          <h3 className='font-bold'>What the most requested features are:</h3>
            <span dangerouslySetInnerHTML={{ __html: featureSummary }}></span>
        </div>

       
      </div>
      <h2 className='font-bold text-center text-2xl mt-4 mb-4'>Competitor analysis</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

        
      <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md text-justify">
          <h3 className='font-bold'>Where your competitor is doing well:</h3>
            <span dangerouslySetInnerHTML={{ __html: competitorDoneWell }}></span>
        </div>

        <div class="bg-white bg-opacity-75 rounded-lg p-4 shadow-md text-justify">
          <h3 className='font-bold'>Where you can step in:</h3>
            <span dangerouslySetInnerHTML={{ __html: companyStepIn }}></span>
        </div>
      </div>
    </div>
     ): (<p>No data yet</p>)} 
     
    </div>
  );
}

export default App;
