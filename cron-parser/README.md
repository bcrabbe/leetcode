## Cron expression

A cron expression is a string comprising five or six fields separated by white space that represents a set of times, normally as a schedule to execute some routine.

```
  * * * * * <command to execute>
# | | | | |
# | | | | day of the week (0–6) (Sunday to Saturday;
# | | | month (1–12)             7 is also Sunday on some systems)
# | | day of the month (1–31)
# | hour (0–23)
# minute (0–59)
```

Comments begin with a comment mark #, and must be on a line by themselves.

| Field        | Required | Allowed values  | Allowed special characters | Remarks                                                          |
|--------------|----------|-----------------|----------------------------|------------------------------------------------------------------|
| Minutes      | Yes      | 0–59            | `*` `,` `-`                |                                                                  |
| Hours        | Yes      | 0–23            | `*` `,` `-`                |                                                                  |
| Day of month | Yes      | 1–31            | `*` `,` `-` `?` `L` `W`    | `?` `L` `W` only in some implementations                         |
| Month        | Yes      | 1–12 or JAN–DEC | `*` `,` `-`                |                                                                  |
| Day of week  | Yes      | 0–6 or SUN–SAT  | `*` `,` `-` `?` `L` `#`    | `?` `L` `#` only in some implementations                         |
| Year         | No       | 1970–2099       | `*` `,` `-`                | This field is not supported in standard/default implementations. |

The month and weekday abbreviations are not case-sensitive.

In the particular case of the system crontab file (/etc/crontab), a *user* field inserts itself before the *command*. It is generally set to 'root'.

In some uses of the cron format there is also a *seconds* field at the beginning of the pattern. In that case, the cron expression is a string comprising 6 or 7 fields.

**Asterisk (`*`)**
Asterisks (also known as wildcard) represents "all". For example, using "* * * * *" will run every minute. Using "* * * * 1" will run every minute only on Monday. Using six asterisks means every second when seconds are supported.

**Comma (`,`)**
Commas are used to separate items of a list. For example, using "MON,WED,FRI" in the 5th field (day of week) means Mondays, Wednesdays and Fridays.

**Hyphen (`-`)**
Hyphen defines ranges. For example, "2000-2010" indicates every year between 2000 and 2010, inclusive.

**Percent (`%`)**
Percent-signs (%) in the command, unless escaped with backslash ($$, are changed into newline characters, and all data after the first % are sent to the command as standard input.

### Non-standard characters

The following are non-standard characters and exist only in some cron implementations, such as the Quartz Java scheduler.

**`L`**
'L' stands for "last". When used in the day-of-week field, it allows specifying constructs such as "the last Friday" (`5L`) of a given month. In the day-of-month field, it specifies the last day of the month.

**`W`**
The 'W' character is allowed for the day-of-month field. This character is used to specify the weekday (Monday-Friday) nearest the given day. As an example, if `15W` is specified as the value for the day-of-month field, the meaning is: "the nearest weekday to the 15th of the month." So, if the 15th is a Saturday, the trigger fires on Friday the 14th. If the 15th is a Sunday, the trigger fires on Monday the 16th. If the 15th is a Tuesday, then it fires on Tuesday the 15th. However, if "1W" is specified as the value for day-of-month, and the 1st is a Saturday, the trigger fires on Monday the 3rd, as it does not 'jump' over the boundary of a month's days. The 'W' character can be specified only when the day-of-month is a single day, not a range or list of days.

**Hash (`#`)**
'#' is allowed for the day-of-week field, and must be followed by a number between one and five. It allows specifying constructs such as "the second Friday" of a given month. For example, entering "5#3" in the day-of-week field corresponds to the third Friday of every month.

**Question mark (`?`)**
In some implementations, used instead of '*' for leaving either day-of-month or day-of-week blank. Other cron implementations substitute "?" with the start-up time of the cron daemon, so that `? ? * * * *` would be updated to `25 8 * * * *` if cron started-up on 8:25am, and would run at this time every day until restarted again.

**Slash (`/`)**
In vixie-cron, slashes can be combined with ranges to specify step values. For example, `*/5` in the minutes field indicates every 5 minutes (see note below about frequencies). It is shorthand for the more verbose POSIX form `5,10,15,20,25,30,35,40,45,50,55,00`. POSIX does not define a use for slashes; its rationale (commenting on a BSD extension) notes that the definition is based on System V format but does not exclude the possibility of extensions.

Note that frequencies in general cannot be expressed; only step values which evenly divide their range express accurate frequencies (for minutes and seconds, that's `/2, /3, /4, /5, /6, /10, /12, /15, /20` and `/30` because 60 is evenly divisible by those numbers; for hours, that's `/2, /3, /4, /6, /8` and `/12`); all other possible "steps" and all other fields yield inconsistent "short" periods at the end of the time-unit before it "resets" to the next minute, second, or day; for example, entering `*/5` for the day field sometimes executes after 1, 2, or 3 days, depending on the month and leap year; this is because cron is stateless (it does not remember the time of the last execution nor count the difference between it and now, required for accurate frequency counting—instead, cron is a mere pattern-matcher).

Some language-specific libraries offering crontab scheduling ability do not require "strict" ranges `15-59/XX` to the left of the slash when ranges are used. In these cases, `15/XX` is the same as a vixie-cron schedule of `15-59/10` in the minutes section. Similarly, you can remove the extra `-23` from `0-23/XX`, `-31` from `1-31/XX`, and `-12` from `1-12/XX` for hours, days, and months; respectively.

**`H`**
'H' is used in the Jenkins continuous integration system to indicate that a "hashed" value is substituted. Thus instead of a fixed number such as `20 * * * *` which means at 20 minutes after the hour every hour, `H * * * *` indicates that the task is performed every hour at an unspecified but invariant time for each task. This allows spreading out tasks over time, rather than having all of them start at the same time and compete for resources.

[1](http://help.ubuntu.com/community/CronHowto)


