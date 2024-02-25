/* eslint-disable eqeqeq */
import logo from './logo.svg';
import './App.css';
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import React, { useState, useEffect } from 'react'


function App() {


  const [reviewData, setReviewData] = useState([]);
  const [positiveSummary, setPositiveSummary] = useState('')
  const [issueSummary, setIssueSummary] = useState('')
  const [featureSummary, setFeatureSummary] = useState('')

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

    fetchData()
    fetchPositiveData()
    fetchIssueData()
    fetchFeatureData()
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
      
     {reviewData && reviewData.length > 0 && positiveSummary != '' && issueSummary != '' && featureSummary != '' ? (
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
    </div>
     ): (<p>No data yet</p>)} 
     
    </div>
  );
}

export default App;
