import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId, action, amount } = await req.json();
    
    if (!userId || !action || amount == null) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (amount < 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Verify user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const current = profile.coins ?? 1000;

    if (action === 'spend' && current < amount) {
      return NextResponse.json({ error: 'Not enough coins', coins: current }, { status: 400 });
    }

    const newCoins = action === 'spend' ? current - amount : current + amount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coins: newCoins })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ coins: newCoins });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
