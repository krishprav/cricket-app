// Simple AI predictor model for cricket matches
// This uses basic heuristics but could be replaced with a more sophisticated ML model

export const predictMatchOutcome = (matchData) => {
    if (!matchData || !matchData.scorecard) {
      return {
        prediction: "Insufficient data for prediction",
        confidence: 0,
        winningTeam: null,
        factors: []
      };
    }
  
    // Extract team names
    const teamsString = matchData.teams || "";
    const teamNames = teamsString.split(" vs ");
    const team1 = teamNames[0] || "Team 1";
    const team2 = teamNames[1] || "Team 2";
    
    // Parse scorecard data
    const battingData = matchData.scorecard?.batting || [];
    const bowlingData = matchData.scorecard?.bowling || [];
    
    // Calculate current run rates and wickets
    let team1Score = 0, team1Wickets = 0, team1Overs = 0;
    let team2Score = 0, team2Wickets = 0, team2Overs = 0;
    
    // Very simple parsing of the scorecard text - in a real app we'd have structured data
    battingData.forEach(text => {
      if (text.includes(team1)) {
        const scoreParts = text.match(/(\d+)\/(\d+)/);
        if (scoreParts) {
          team1Score = parseInt(scoreParts[1]);
          team1Wickets = parseInt(scoreParts[2]);
        }
        const oversParts = text.match(/\((\d+\.\d+)/);
        if (oversParts) {
          team1Overs = parseFloat(oversParts[1]);
        }
      } else if (text.includes(team2)) {
        const scoreParts = text.match(/(\d+)\/(\d+)/);
        if (scoreParts) {
          team2Score = parseInt(scoreParts[1]);
          team2Wickets = parseInt(scoreParts[2]);
        }
        const oversParts = text.match(/\((\d+\.\d+)/);
        if (oversParts) {
          team2Overs = parseFloat(oversParts[1]);
        }
      }
    });
    
    // Match stage detection
    const isFirstInningsComplete = team1Score > 0 && team1Overs >= 20;
    const isSecondInningsStarted = team2Score > 0;
    const matchStage = isSecondInningsStarted ? "second_innings" : "first_innings";
    
    // Calculate required run rate for team batting second
    let requiredRunRate = 0;
    let remainingRuns = 0;
    let remainingOvers = 0;
    
    if (isFirstInningsComplete && isSecondInningsStarted) {
      remainingRuns = team1Score - team2Score + 1;
      remainingOvers = 20 - team2Overs;
      requiredRunRate = remainingOvers > 0 ? remainingRuns / remainingOvers : 99;
    }
    
    // Factors affecting the prediction
    const factors = [];
    
    // Current run rates
    const team1RunRate = team1Overs > 0 ? team1Score / team1Overs : 0;
    const team2RunRate = team2Overs > 0 ? team2Score / team2Overs : 0;
    
    if (team1RunRate > 0) factors.push(`${team1} run rate: ${team1RunRate.toFixed(2)}`);
    if (team2RunRate > 0) factors.push(`${team2} run rate: ${team2RunRate.toFixed(2)}`);
    if (requiredRunRate > 0) factors.push(`Required run rate: ${requiredRunRate.toFixed(2)}`);
    
    // Wickets remaining
    const team1WicketsRemaining = 10 - team1Wickets;
    const team2WicketsRemaining = 10 - team2Wickets;
    
    if (team1WicketsRemaining < 10) factors.push(`${team1} has ${team1WicketsRemaining} wickets remaining`);
    if (team2WicketsRemaining < 10) factors.push(`${team2} has ${team2WicketsRemaining} wickets remaining`);
    
    // Make prediction based on stage
    let winningTeam = null;
    let winProbability = 50; // Default to 50-50
    let predictionText = "";
    
    if (matchStage === "first_innings") {
      // Predict based on current run rate compared to average T20 score
      const projectedScore = team1RunRate * 20;
      const avgT20Score = 160;
      
      if (projectedScore > avgT20Score + 20) {
        winProbability = 60 + Math.min((projectedScore - avgT20Score) / 4, 25);
        winningTeam = team1;
        predictionText = `${team1} is projected to score ${Math.round(projectedScore)} which is above average, giving them the edge`;
      } else if (projectedScore < avgT20Score - 20) {
        winProbability = 60 + Math.min((avgT20Score - projectedScore) / 4, 25);
        winningTeam = team2;
        predictionText = `${team1} is projected to score ${Math.round(projectedScore)} which is below average, giving ${team2} the edge`;
      } else {
        predictionText = `${team1} is projected to score around ${Math.round(projectedScore)} which is near average, making this a balanced game`;
      }
      
    } else if (matchStage === "second_innings") {
      // Predict based on required run rate vs current run rate and wickets
      if (remainingRuns <= 0) {
        winProbability = 100;
        winningTeam = team2;
        predictionText = `${team2} has achieved the target`;
      } else if (team2Wickets === 10) {
        winProbability = 100;
        winningTeam = team1;
        predictionText = `${team1} has won by ${remainingRuns - 1} runs`;
      } else if (requiredRunRate > team2RunRate + 4) {
        winProbability = 70 + Math.min((requiredRunRate - team2RunRate) * 5, 25);
        winningTeam = team1;
        predictionText = `${team2} needs to significantly increase their run rate (${requiredRunRate.toFixed(2)} required vs ${team2RunRate.toFixed(2)} current)`;
      } else if (requiredRunRate < team2RunRate - 2) {
        winProbability = 70 + Math.min((team2RunRate - requiredRunRate) * 5, 25);
        winningTeam = team2;
        predictionText = `${team2} is ahead of the required rate and likely to win`;
      } else {
        // Close game - factor in wickets remaining
        if (team2WicketsRemaining >= 6) {
          winProbability = 55 + team2WicketsRemaining * 2;
          winningTeam = team2;
          predictionText = `Close game but ${team2} has good batting resources remaining`;
        } else if (team2WicketsRemaining <= 3) {
          winProbability = 55 + (6 - team2WicketsRemaining) * 5;
          winningTeam = team1;
          predictionText = `Close game but ${team2} is running out of batting resources`;
        } else {
          predictionText = `This match is too close to call, with balanced chances for both teams`;
        }
      }
    }
    
    // Cap win probability between 50 and 95
    winProbability = Math.max(50, Math.min(95, winProbability));
    
    // For really early stages with insufficient data
    if (factors.length < 2 || (team1Score === 0 && team2Score === 0)) {
      return {
        prediction: "Insufficient data for prediction",
        confidence: 0,
        winningTeam: null,
        factors: []
      };
    }
    
    return {
      prediction: predictionText,
      confidence: winProbability,
      winningTeam: winningTeam,
      factors
    };
  };
  
  // Mock function to predict player of the match
  export const predictPlayerOfMatch = (matchData) => {
    if (!matchData || !matchData.scorecard) {
      return null;
    }
    
    // This is a simplified mock implementation
    // In a real app, we would analyze player performances
    const battingData = matchData.scorecard?.batting || [];
    const bowlingData = matchData.scorecard?.bowling || [];
    
    // Look for high scores or good bowling figures in the text
    let highestRunScorer = { name: null, runs: 0 };
    let bestBowler = { name: null, wickets: 0 };
    
    // Very simple parsing - in a real app we'd have structured data
    battingData.forEach(text => {
      const runMatch = text.match(/([A-Za-z\s]+)\s+(\d+)/);
      if (runMatch && runMatch[2] && parseInt(runMatch[2]) > highestRunScorer.runs) {
        highestRunScorer = {
          name: runMatch[1].trim(),
          runs: parseInt(runMatch[2])
        };
      }
    });
    
    bowlingData.forEach(text => {
      const wicketMatch = text.match(/([A-Za-z\s]+)\s+\d+-\d+-\d+-(\d+)/);
      if (wicketMatch && wicketMatch[2] && parseInt(wicketMatch[2]) > bestBowler.wickets) {
        bestBowler = {
          name: wicketMatch[1].trim(),
          wickets: parseInt(wicketMatch[2])
        };
      }
    });
    
    // Choose between highest run scorer and best bowler
    if (highestRunScorer.runs >= 50 && highestRunScorer.runs > bestBowler.wickets * 20) {
      return {
        name: highestRunScorer.name,
        performance: `${highestRunScorer.runs} runs`,
        reason: `Commanding batting performance`
      };
    } else if (bestBowler.wickets >= 3) {
      return {
        name: bestBowler.name,
        performance: `${bestBowler.wickets} wickets`,
        reason: `Match-winning bowling spell`
      };
    } else if (highestRunScorer.name) {
      return {
        name: highestRunScorer.name,
        performance: `${highestRunScorer.runs} runs`,
        reason: `Top scoring batsman`
      };
    } else {
      return null;
    }
  };