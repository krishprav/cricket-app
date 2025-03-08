// Format a scorecard row from plain text
export const formatScorecardRow = (text) => {
    if (!text) return null;
    
    // Try to extract batter information
    const batterRegex = /([A-Za-z\s\.']+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d\.]+)/;
    const batterMatch = text.match(batterRegex);
    
    if (batterMatch) {
      return {
        type: 'batter',
        name: batterMatch[1].trim(),
        runs: parseInt(batterMatch[2]),
        balls: parseInt(batterMatch[3]),
        fours: parseInt(batterMatch[4]),
        sixes: parseInt(batterMatch[5]),
        strikeRate: parseFloat(batterMatch[6])
      };
    }
    
    // Try to extract bowler information
    const bowlerRegex = /([A-Za-z\s\.']+)\s+([\d\.]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d\.]+)/;
    const bowlerMatch = text.match(bowlerRegex);
    
    if (bowlerMatch) {
      return {
        type: 'bowler',
        name: bowlerMatch[1].trim(),
        overs: parseFloat(bowlerMatch[2]),
        maidens: parseInt(bowlerMatch[3]),
        runs: parseInt(bowlerMatch[4]),
        wickets: parseInt(bowlerMatch[5]),
        noBalls: parseInt(bowlerMatch[6]),
        wides: parseInt(bowlerMatch[7]),
        economy: parseFloat(bowlerMatch[8])
      };
    }
    
    // Try to match team scores
    const teamScoreRegex = /([A-Za-z\s]+)\s+(\d+)\/(\d+)\s+\((\d+\.\d+)/;
    const teamMatch = text.match(teamScoreRegex);
    
    if (teamMatch) {
      return {
        type: 'team',
        name: teamMatch[1].trim(),
        runs: parseInt(teamMatch[2]),
        wickets: parseInt(teamMatch[3]),
        overs: parseFloat(teamMatch[4])
      };
    }
    
    return {
      type: 'unknown',
      text
    };
  };
  
  // Parse scorecard data
  export const parseScorecard = (battingData, bowlingData) => {
    if (!battingData || !bowlingData) return null;
    
    // Extract team names and organize data
    const teams = [];
    const scorecard = {};
    
    let currentTeam = null;
    
    // Process batting data
    battingData.forEach(text => {
      const formattedRow = formatScorecardRow(text);
      
      if (formattedRow?.type === 'team') {
        currentTeam = formattedRow.name;
        teams.push(currentTeam);
        
        if (!scorecard[currentTeam]) {
          scorecard[currentTeam] = {
            batting: [],
            bowling: [],
            score: {
              runs: formattedRow.runs,
              wickets: formattedRow.wickets,
              overs: formattedRow.overs
            }
          };
        }
      } else if (formattedRow?.type === 'batter' && currentTeam) {
        scorecard[currentTeam].batting.push(formattedRow);
      }
    });
    
    // Reset current team for bowling data
    currentTeam = teams[1]; // Typically the first team to bat has the second team bowling
    
    // Process bowling data
    bowlingData.forEach(text => {
      const formattedRow = formatScorecardRow(text);
      
      if (formattedRow?.type === 'team') {
        // Switch to the other team's bowling
        currentTeam = formattedRow.name === teams[0] ? teams[1] : teams[0];
      } else if (formattedRow?.type === 'bowler' && currentTeam) {
        // Add bowler to the opposing team's bowling
        const opposingTeam = currentTeam === teams[0] ? teams[1] : teams[0];
        if (scorecard[opposingTeam]) {
          scorecard[opposingTeam].bowling.push(formattedRow);
        }
      }
    });
    
    return { teams, scorecard };
  };
  
  // Extract highlights from commentary
  export const extractHighlights = (commentary) => {
    if (!commentary || !Array.isArray(commentary)) return [];
    
    const highlights = [];
    const highlightKeywords = [
      'FOUR', 'SIX', 'OUT', 'WICKET', 'FIFTY', 'CENTURY', 
      'HUNDRED', 'CATCH', 'BOWLED', 'LBW', 'RUN OUT'
    ];
    
    commentary.forEach(comment => {
      const upperComment = comment.toUpperCase();
      const isHighlight = highlightKeywords.some(keyword => upperComment.includes(keyword));
      
      if (isHighlight) {
        // Determine the highlight type
        let type = 'other';
        
        if (upperComment.includes('FOUR')) type = 'four';
        else if (upperComment.includes('SIX')) type = 'six';
        else if (upperComment.includes('OUT') || upperComment.includes('WICKET')) type = 'wicket';
        else if (upperComment.includes('FIFTY')) type = 'fifty';
        else if (upperComment.includes('CENTURY') || upperComment.includes('HUNDRED')) type = 'century';
        
        highlights.push({
          text: comment,
          type
        });
      }
    });
    
    return highlights;
  };
  
  // Format match status
  export const formatMatchStatus = (status) => {
    if (!status) return 'Unknown';
    
    if (status.toLowerCase().includes('live')) {
      return 'LIVE';
    } else if (status.toLowerCase().includes('complete')) {
      return 'Completed';
    } else {
      return status;
    }
  };
  
  // Format share text for social media
  export const formatShareText = (matchData) => {
    if (!matchData) return '';
    
    const { teams, score, status } = matchData;
    
    let shareText = `🏏 Cricket Update\n`;
    
    if (teams) {
      shareText += `${teams}\n`;
    }
    
    if (score) {
      shareText += `${score}\n`;
    }
    
    if (status) {
      shareText += `Status: ${status}\n`;
    }
    
    // Add AI prediction if available
    if (matchData.prediction) {
      shareText += `\n🤖 AI Prediction: ${matchData.prediction.prediction}\n`;
      if (matchData.prediction.winningTeam) {
        shareText += `Predicted Winner: ${matchData.prediction.winningTeam} (${matchData.prediction.confidence}% confidence)\n`;
      }
    }
    
    shareText += `\nCheck out the live match on our Cricket App!`;
    
    return encodeURIComponent(shareText);
  };
  
  // Share to social media
  export const shareToSocial = (platform, shareText) => {
    let url = '';
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${shareText}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=https://cricket-gray.vercel.app&text=${shareText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=https://cricket-gray.vercel.app&quote=${shareText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=https://cricket-gray.vercel.app&summary=${shareText}`;
        break;
      default:
        url = '';
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };