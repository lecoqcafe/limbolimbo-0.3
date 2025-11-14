import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "@/lib/userActivity";
import { Eye, MousePointer, ExternalLink, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface ActivityCardProps {
  activity: Activity;
  onOpportunityClick?: (opportunityId: string) => void;
}

const ActivityCard = ({ activity, onOpportunityClick }: ActivityCardProps) => {
  const isVisit = activity.type === 'visit';
  const icon = isVisit ? Eye : MousePointer;
  const iconColor = isVisit ? "text-blue-500" : "text-green-500";
  const badgeVariant = isVisit ? "secondary" : "default";
  const badgeText = isVisit ? "Visite" : "Clic";

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    return formatDate(timestamp);
  };

  return (
    <Card className="bg-gradient-card shadow-card border border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg bg-background ${iconColor}`}>
              {isVisit ? (
                <Eye className="h-4 w-4" aria-hidden="true" />
              ) : (
                <MousePointer className="h-4 w-4" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-medium text-foreground truncate">
                {activity.opportunityName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={badgeVariant} className="text-xs">
                  {badgeText}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{getRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            ID: {activity.opportunityId}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpportunityClick?.(activity.opportunityId)}
              className="text-xs h-8"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Voir
            </Button>
            
            <Link to={`/opportunite?id=${activity.opportunityId}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-2"
              >
                Détails
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          {formatDate(activity.timestamp)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;