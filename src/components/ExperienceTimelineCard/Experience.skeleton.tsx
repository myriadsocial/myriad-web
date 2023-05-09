import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import BaseSekeleton from '@material-ui/lab/Skeleton';

export const Skeleton = ({ menuDrawer = false }: { menuDrawer?: boolean }) => {
  return (
    <Card
      style={{
        padding: menuDrawer ? '5px 10px' : 20,
        borderRadius: 10,
        marginBottom: menuDrawer ? 10 : 30,
        width: '100%',
      }}>
      <Grid
        container
        direction="row"
        style={{ width: '100%' }}
        alignItems="center">
        <BaseSekeleton
          variant="rect"
          width={menuDrawer ? 40 : 68}
          height={menuDrawer ? 40 : 68}
        />

        <Grid
          item
          container
          direction="column"
          style={{ marginLeft: 20, width: 'calc(100% - 88px)' }}>
          <BaseSekeleton variant="text" width={'100%'} height={24} />
          <BaseSekeleton variant="text" width={'50%'} height={16} />
        </Grid>
      </Grid>
    </Card>
  );
};
