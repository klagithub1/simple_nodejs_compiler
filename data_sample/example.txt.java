class Utility
{
int var1[4][5][7][8][9][1][0];
float var2;
int findMax(int array[100])
{
int maxValue;
int idx;
maxValue = array[100];
for( int idx = 99; idx > 0; idx = idx - 1 )
{
if(array[idx] > maxValue) then {
maxValue = array[idx];
}else{};
};
return (maxValue);
};
int findMin(int array[100])
{
int minValue;
int idx;
minValue = array[100];
for( int idx = 1; idx <= 99; idx = ( idx ) + 1)
{
if(array[idx] < maxValue) then {
maxValue = array[idx];
}else{};
};
return (minValue);
};
};
program {
int sample[100];
int idx;
int maxValue;
int minValue;
Utility utility;
Utility arrayUtility[2][3][6][7];
for(int t = 0; t<=100 ; t = t + 1)
{
get(sample[t]);
sample[t] = (sample[t] * randomize());
};
maxValue = utility.findMax(sample);
minValue = utility.findMin(sample);
utility. var1[4][1][0][0][0][0][0] = 10;
arrayUtility[1][1][1][1].var1[4][1][0][0][0][0][0] = 2;
put(maxValue);
put(minValue);
};

float randomize()
{
    float value;
    value = 100 * (2 + 3.0 / 7.0006);
    value = 1.05 + ((2.04 * 2.47) - 3.0) + 7.0006 ;
    return (value);
};