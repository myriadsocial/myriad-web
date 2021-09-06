import {MentionNode, MentionNodeData} from '@udecode/plate-mention';
import {StyledElementProps} from '@udecode/plate-styled-components';

// renderElement props
export interface HashtagElementProps extends StyledElementProps<MentionNode> {
  /**
   * Prefix rendered before mention
   */
  prefix?: string;
  onClick?: (mentionNode: MentionNode) => void;
  renderLabel?: (mentionable: MentionNodeData) => string | React.ReactNode;
}
